import { ApiResponseProperty } from '@nestjs/swagger';

export class InternalServerErrorResponse {
  @ApiResponseProperty({ type: Number })
  code: number;

  @ApiResponseProperty({ type: String })
  name: string;

  @ApiResponseProperty({
    type: Array,
    example: [
      {
        path: 'string',
        method: 'string',
        message: 'string',
        timestamp: 'string',
        parameters: '{}',
      },
    ],
  })
  errors: [
    {
      path: string;
      method: string;
      message: string;
      timestamp: string;
      parameters: any;
    },
  ];
}
