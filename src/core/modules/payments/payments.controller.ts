import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Role, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaymeRequest } from 'src/common/types/payme';

// @ApiExcludeController(true)
@ApiTags('Payment')
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: Role.STUDENT })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @Post('api/payment/checkout')
  createPayment(@Body() payload: CreatePaymentDto, @Req() req: any) {
    return this.paymentsService.createPayment(payload, req.user);
  }

  @ApiExcludeEndpoint()
  @Post('payment/payme/gateway')
  paymeRequest(
    @Body() payload: PaymeRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.paymentsService.handlePaymeRequest(payload, req, res);
  }

  // TODO: Will be removed
  @ApiExcludeEndpoint()
  @Get('payment/delete-transactions')
  deleteAllTransactions() {
    return this.paymentsService.deleteTransactions();
  }
}
