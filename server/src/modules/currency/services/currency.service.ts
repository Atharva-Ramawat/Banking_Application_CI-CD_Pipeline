import { HttpService, Injectable } from '@nestjs/common';
import { PageMetaDto } from 'common/dtos';
import { ForeignExchangeRatesNotFoundException } from 'exceptions';
import {
  CurrenciesPageDto,
  CurrenciesPageOptionsDto,
} from 'modules/currency/dtos';
import { CurrencyEntity } from 'modules/currency/entities';
import { CurrencyRepository } from 'modules/currency/repositories';

@Injectable()
export class CurrencyService {
  constructor(
    private readonly _currencyRepository: CurrencyRepository,
    private readonly _httpService: HttpService,
  ) {}

  public async getCurrencies(
    pageOptionsDto: CurrenciesPageOptionsDto,
  ): Promise<CurrenciesPageDto | undefined> {
    const queryBuilder = this._currencyRepository.createQueryBuilder(
      'currency',
    );

    const [currencies, currenciesCount] = await queryBuilder
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: currenciesCount,
    });

    return new CurrenciesPageDto(currencies.toDtos(), pageMetaDto);
  }

  public async findCurrency(
    options: Partial<{ uuid: string; name: string }>,
  ): Promise<CurrencyEntity | undefined> {
    const queryBuilder = this._currencyRepository.createQueryBuilder(
      'currency',
    );

    if (options.uuid) {
      queryBuilder.orWhere('currency.uuid = :uuid', {
        uuid: options.uuid,
      });
    }

    if (options.name) {
      queryBuilder.orWhere('currency.name = :name', {
        name: options.name,
      });
    }

    return queryBuilder.getOne();
  }

  public async upsertCurrencyForeignExchangeRates(
    name: string,
    currentExchangeRate: number,
    base: boolean,
  ): Promise<void> {
    const queryBuilder = this._currencyRepository.createQueryBuilder(
      'currency',
    );

    await queryBuilder
      .insert()
      .values({ name, currentExchangeRate, base })
      .onConflict(
        `("name") DO UPDATE
                SET current_exchange_rate = :currentExchangeRate`,
      )
      .setParameter('currentExchangeRate', currentExchangeRate)
      .execute();
  }

  public async getCurrencyForeignExchangeRates() {
    const [EUR, USD, INR] = await Promise.all([
      this.getCurrencyForeignExchangeRatesForEUR(),
      this.getCurrencyForeignExchangeRatesForUSD(),
      this.getCurrencyForeignExchangeRatesForINR(),
    ]);

    const midEUR = 1 / ((EUR.rates[0].bid + EUR.rates[0].ask) / 2);
    const midUSD = 1 / ((USD.rates[0].bid + USD.rates[0].ask) / 2);
    const midINR = 1 / ((INR.rates[0].bid + INR.rates[0].ask) / 2);

    return [
      { name: EUR.code, currentExchangeRate: midEUR },
      { name: USD.code, currentExchangeRate: midUSD },
      { name: INR.code, currentExchangeRate: midINR },
    ];
  }

  public async getCurrencyForeignExchangeRatesForUSD(): Promise<any> {
    const endpoint = `https://api.nbp.pl/api/exchangerates/rates/c/usd/today/?format=json`;
    const fallbackEndpoint = `https://api.nbp.pl/api/exchangerates/rates/c/usd/?format=json`;

    return this._httpService
      .get(endpoint)
      .toPromise()
      .then((response) => response.data)
      .catch(() =>
        this._httpService
          .get(fallbackEndpoint)
          .toPromise()
          .then((response) => response.data),
      )
      .catch(() => ({
        code: 'USD',
        rates: [{ bid: 3.8, ask: 3.9 }],
      }));
  }

  public async getCurrencyForeignExchangeRatesForEUR(): Promise<any> {
    const endpoint = `https://api.nbp.pl/api/exchangerates/rates/c/eur/today/?format=json`;
    const fallbackEndpoint = `https://api.nbp.pl/api/exchangerates/rates/c/eur/?format=json`;

    return this._httpService
      .get(endpoint)
      .toPromise()
      .then((response) => response.data)
      .catch(() =>
        this._httpService
          .get(fallbackEndpoint)
          .toPromise()
          .then((response) => response.data),
      )
      .catch(() => ({
        code: 'EUR',
        rates: [{ bid: 4.4, ask: 4.5 }],
      }));
  }

  public async getCurrencyForeignExchangeRatesForINR(): Promise<any> {
    const endpoint = `https://api.nbp.pl/api/exchangerates/rates/c/inr/today/?format=json`;
    const fallbackEndpoint = `https://api.nbp.pl/api/exchangerates/rates/c/inr/?format=json`;

    return this._httpService
      .get(endpoint)
      .toPromise()
      .then((response) => response.data)
      .catch(() =>
        this._httpService
          .get(fallbackEndpoint)
          .toPromise()
          .then((response) => response.data),
      )
      .catch(() => ({
        code: 'INR',
        rates: [{ bid: 0.045, ask: 0.047 }],
      }));
  }
}
