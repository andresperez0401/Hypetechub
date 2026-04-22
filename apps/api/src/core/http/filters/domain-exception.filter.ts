import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import type { Response } from 'express';
import { DomainException } from '../../exceptions/domain.exception';

/**
 * Global filter: catches any DomainException thrown from a use case and
 * converts it to the appropriate HTTP response using the error's httpStatus.
 * This keeps HTTP translation out of controllers and use cases.
 */
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.warn(`Domain error [${exception.code}]: ${exception.message}`);

    response.status(exception.httpStatus).json({
      statusCode: exception.httpStatus,
      error: exception.code,
      message: exception.message,
    });
  }
}
