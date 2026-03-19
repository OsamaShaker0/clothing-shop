import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAccessOnlyGuard } from 'src/auth/guards/admin-access-only.guard';
import { CreateCouponDto } from 'src/coupons/dtos/create-coupon.dto';
import { UpdateCouponPercentageDto } from 'src/coupons/dtos/update-coupon-percentage.dto';
import { CouponService } from 'src/coupons/providers/coupon.service';
@ApiTags('Coupon Dashboard')
@ApiBearerAuth()
@UseGuards(AdminAccessOnlyGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('coupon-dashboard')
export class CouponDashboardController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  @ApiOperation({ summary: 'Get all coupons' })
  @ApiResponse({ status: 200, description: 'List of coupons returned' })
  public async getAllCoupons() {
    return this.couponService.getAllCoupons();
  }
  @Get(':couponId')
  @ApiOperation({ summary: 'Get coupon by ID' })
  @ApiParam({ name: 'couponId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Coupon found' })
  public async getOneCouponById(
    @Param('couponId', new ParseUUIDPipe()) couponId: string,
  ) {
    return this.couponService.getOneCouponWithId(couponId);
  }
  @Post()
  @ApiOperation({ summary: 'Create a new coupon' })
  @ApiResponse({ status: 201, description: 'Coupon created successfully' })
  public async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.createCoupon(createCouponDto);
  }
  @Patch(':couponId/percentage')
  @ApiOperation({ summary: 'Update coupon percentage' })
  @ApiParam({ name: 'couponId', type: 'string', format: 'uuid' })
  public async editCouponPercentage(
    @Param('couponId', new ParseUUIDPipe()) couponId: string,
    @Body() updateCouponPercentageDto: UpdateCouponPercentageDto,
  ) {
    return this.couponService.updateCouponPercentage(
      couponId,
      updateCouponPercentageDto,
    );
  }
  @Patch(':couponId/validation')
  @ApiOperation({ summary: 'Activate/Deactivate coupon' })
  @ApiParam({ name: 'couponId', type: 'string', format: 'uuid' })
  public async editCouponValidation(
    @Param('couponId', new ParseUUIDPipe()) couponId: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.couponService.updateCouponValidation(couponId, isActive);
  }
  @Delete(':couponId')
  @ApiOperation({ summary: 'Delete a coupon' })
  @ApiParam({ name: 'couponId', type: 'string', format: 'uuid' })
  public async deleteCoupon(
    @Param('couponId', new ParseUUIDPipe()) couponId: string,
  ) {
    return this.couponService.deleteCoupon(couponId);
  }
}
