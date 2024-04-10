import { ApiResponseProperty } from "@nestjs/swagger";

export class CollaboratorsNazanResponse {
	@ApiResponseProperty()
	ORGANIZATION_ID: number;
	@ApiResponseProperty()
	CUST_ID: string;
	@ApiResponseProperty()
	CARD_NUM: string;
	@ApiResponseProperty()
	FIRST_NAME: string;
	@ApiResponseProperty()
	MIDDLE_NAME: string;
	@ApiResponseProperty()
	LAST_NAME: string;
	@ApiResponseProperty()
	last_name2: string;
	@ApiResponseProperty()
	PARTY_TYPE_CODE: string;
	@ApiResponseProperty()
	CUSTOMER_GROUPS: string;
	@ApiResponseProperty()
	CUSTOMER_TYPE: string;
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
