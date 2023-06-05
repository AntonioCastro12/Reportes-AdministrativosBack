import { ApiResponseProperty } from "@nestjs/swagger";

export class CollaboratorsNazanResponse {
	@ApiResponseProperty()
	store_id: string;
	@ApiResponseProperty()
	segment: number;
	@ApiResponseProperty()
	membership: string;
	@ApiResponseProperty()
	client_id: string;
	@ApiResponseProperty()
	first_name: string;
	@ApiResponseProperty()
	second_name: string;
	@ApiResponseProperty()
	last_name: string;
	@ApiResponseProperty()
	second_last_name: string;
	@ApiResponseProperty()
	cellphone_number: string;
	@ApiResponseProperty()
	mail: string;
	@ApiResponseProperty()
	birthday: string;
	@ApiResponseProperty()
	gender: string;
	@ApiResponseProperty()
	marital_status: string;
	@ApiResponseProperty()
	signup_date: string;
}

export class AffiliatedKiponResponse {
	@ApiResponseProperty()
	store_id: string;
	@ApiResponseProperty()
	membership: string;
	@ApiResponseProperty()
	cust_id: string;
	@ApiResponseProperty()
	first_name: string;
	@ApiResponseProperty()
	second_name: string;
	@ApiResponseProperty()
	surname: string;
	@ApiResponseProperty()
	lastname: string;
	@ApiResponseProperty()
	home_phone: string;
	@ApiResponseProperty()
	cel_phone: string;
	@ApiResponseProperty()
	business_phone: string;
	@ApiResponseProperty()
	email: string;
	@ApiResponseProperty()
	birthday: string;
	@ApiResponseProperty()
	gender: string;
	@ApiResponseProperty()
	status: string;
	@ApiResponseProperty()
	signup_date: string;
}