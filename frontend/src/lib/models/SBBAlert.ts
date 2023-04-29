export interface SBBAlert {
	start: Date;
	end: Date;
	planned: boolean;
	summary: string;
	reason: string | undefined;
	description: string | undefined;
	consequence: string | undefined;
	duration: string | undefined;
	recommendation: string | undefined;
}
