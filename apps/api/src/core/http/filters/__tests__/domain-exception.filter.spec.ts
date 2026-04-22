import type { ArgumentsHost } from '@nestjs/common';
import { DomainException } from '../../../exceptions/domain.exception';
import { DomainExceptionFilter } from '../domain-exception.filter';

function makeHost(statusFn: jest.Mock): ArgumentsHost {
  return {
    switchToHttp: () => ({
      getResponse: () => ({
        status: statusFn,
      }),
    }),
  } as unknown as ArgumentsHost;
}

describe('DomainExceptionFilter', () => {
  let filter: DomainExceptionFilter;

  beforeEach(() => {
    filter = new DomainExceptionFilter();
  });

  it('responds with exception httpStatus and code', () => {
    const jsonFn = jest.fn();
    const statusFn = jest.fn().mockReturnValue({ json: jsonFn });
    const host = makeHost(statusFn);

    const exception = new DomainException('SOME_ERROR', 'Something failed', 409);

    filter.catch(exception, host);

    expect(statusFn).toHaveBeenCalledWith(409);
    expect(jsonFn).toHaveBeenCalledWith({
      statusCode: 409,
      error: 'SOME_ERROR',
      message: 'Something failed',
    });
  });

  it('uses default status 422 when not specified', () => {
    const jsonFn = jest.fn();
    const statusFn = jest.fn().mockReturnValue({ json: jsonFn });
    const host = makeHost(statusFn);

    const exception = new DomainException('GENERIC', 'generic error');

    filter.catch(exception, host);

    expect(statusFn).toHaveBeenCalledWith(422);
  });
});
