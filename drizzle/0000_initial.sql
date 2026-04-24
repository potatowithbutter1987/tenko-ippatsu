CREATE TABLE "admin_action_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_user_id" uuid NOT NULL,
	"action_type" smallint NOT NULL,
	"target_table" varchar(64) NOT NULL,
	"target_id" uuid,
	"diff" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"parent_company_id" uuid,
	"tier_level" smallint NOT NULL,
	"representative" varchar(50),
	"email" varchar(254),
	"phone_number" varchar(15),
	"is_active" smallint DEFAULT 1 NOT NULL,
	"retired_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_report_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"daily_report_id" uuid NOT NULL,
	"kind" smallint NOT NULL,
	"blob_url" text NOT NULL,
	"blob_pathname" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar(64) NOT NULL,
	"width" integer,
	"height" integer,
	"taken_at" timestamp with time zone,
	"capture_method" smallint NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "daily_report_edit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"daily_report_id" uuid NOT NULL,
	"edited_by" uuid NOT NULL,
	"edit_reason" text NOT NULL,
	"field_changes" jsonb NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"edited_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"shift_id" uuid NOT NULL,
	"target_date" date NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"line_user_id_snapshot" varchar(64),
	"company_id_snapshot" uuid NOT NULL,
	"start_reported_at" timestamp with time zone,
	"start_inspector_type" smallint,
	"start_inspector_name" varchar(50),
	"start_inspection_method" smallint,
	"start_inspection_method_note" text,
	"start_license_confirmed" smallint,
	"start_health_status" smallint,
	"start_vehicle_check_status" smallint,
	"start_vehicle_check_details" jsonb,
	"start_alcohol_used" smallint,
	"start_alcohol_value" numeric(3, 2),
	"start_alcohol_status" smallint,
	"start_odometer" integer,
	"start_location" jsonb,
	"start_message" text,
	"end_reported_at" timestamp with time zone,
	"end_inspector_type" smallint,
	"end_inspector_name" varchar(50),
	"end_inspection_method" smallint,
	"end_inspection_method_note" text,
	"end_alcohol_used" smallint,
	"end_alcohol_value" numeric(3, 2),
	"end_alcohol_status" smallint,
	"end_odometer" integer,
	"end_status_report_type" smallint,
	"end_status_report_note" text,
	"end_handover_type" smallint,
	"end_handover_note" text,
	"end_rest_location" text,
	"end_location" jsonb,
	"end_message" text,
	"driving_distance_km" integer GENERATED ALWAYS AS (end_odometer - start_odometer) STORED,
	"is_alert" smallint DEFAULT 0 NOT NULL,
	"alert_reasons" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "daily_reports_shift_id_unique" UNIQUE("shift_id"),
	CONSTRAINT "daily_reports_end_rest_required" CHECK ("daily_reports"."end_reported_at" IS NULL OR "daily_reports"."end_rest_location" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "driver_company_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"valid_from" date NOT NULL,
	"valid_to" date,
	"reason" text,
	"changed_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_company_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"valid_from" date NOT NULL,
	"valid_to" date,
	"reason" text,
	"changed_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" smallint NOT NULL,
	"default_start_time" time,
	"default_end_time" time,
	"pickup_location" varchar(100) NOT NULL,
	"delivery_location" varchar(100) NOT NULL,
	"rest_locations" jsonb,
	"logo_url" text,
	"unit_price" integer,
	"current_owner_company_id" uuid,
	"is_active" smallint DEFAULT 1 NOT NULL,
	"retired_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"scheduled_date" date NOT NULL,
	"project_id" uuid NOT NULL,
	"vehicle_id" uuid,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone,
	"note" text,
	"status" smallint NOT NULL,
	"created_by" uuid NOT NULL,
	"confirmed_by" uuid,
	"confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"cancelled_at" timestamp with time zone,
	CONSTRAINT "shifts_end_after_start" CHECK ("shifts"."end_at" IS NULL OR "shifts"."end_at" > "shifts"."start_at"),
	CONSTRAINT "shifts_confirmed_has_approver" CHECK ("shifts"."status" <> 1 OR ("shifts"."confirmed_by" IS NOT NULL AND "shifts"."confirmed_at" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "system_consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"document_type" smallint NOT NULL,
	"document_version" varchar(16) NOT NULL,
	"agreed_at" timestamp with time zone NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "user_auth_credentials" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"password_changed_at" timestamp with time zone NOT NULL,
	"last_login_at" timestamp with time zone,
	"last_login_ip" varchar(45),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"line_user_id" varchar(64),
	"email" varchar(254),
	"name" varchar(50) NOT NULL,
	"birth_date" date NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"role" smallint DEFAULT 0 NOT NULL,
	"status" smallint DEFAULT 0 NOT NULL,
	"self_reported_company_name" varchar(100),
	"self_reported_vehicle_no" varchar(20),
	"self_reported_at" timestamp with time zone,
	"current_company_id" uuid,
	"main_project_id" uuid,
	"default_vehicle_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_line_user_id_unique" UNIQUE("line_user_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plate_number" varchar(20) NOT NULL,
	"name" varchar(50),
	"ownership_type" smallint NOT NULL,
	"owner_company_id" uuid,
	"owner_user_id" uuid,
	"inspection_expiry_date" date,
	"is_active" smallint DEFAULT 1 NOT NULL,
	"retired_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_plate_number_unique" UNIQUE("plate_number"),
	CONSTRAINT "vehicles_ownership_exclusive" CHECK (("vehicles"."ownership_type" = 0 AND "vehicles"."owner_company_id" IS NOT NULL AND "vehicles"."owner_user_id" IS NULL)
         OR ("vehicles"."ownership_type" = 1 AND "vehicles"."owner_user_id" IS NOT NULL AND "vehicles"."owner_company_id" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "work_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"shift_id" uuid NOT NULL,
	"target_date" date NOT NULL,
	"project_id" uuid NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"ended_at" timestamp with time zone,
	"break_time_min" integer,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "work_records_shift_id_unique" UNIQUE("shift_id"),
	CONSTRAINT "work_records_ended_after_started" CHECK ("work_records"."ended_at" IS NULL OR "work_records"."ended_at" > "work_records"."started_at")
);
--> statement-breakpoint
ALTER TABLE "admin_action_logs" ADD CONSTRAINT "admin_action_logs_admin_user_id_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_parent_company_id_companies_id_fk" FOREIGN KEY ("parent_company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_report_attachments" ADD CONSTRAINT "daily_report_attachments_daily_report_id_daily_reports_id_fk" FOREIGN KEY ("daily_report_id") REFERENCES "public"."daily_reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_report_attachments" ADD CONSTRAINT "daily_report_attachments_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_report_edit_logs" ADD CONSTRAINT "daily_report_edit_logs_daily_report_id_daily_reports_id_fk" FOREIGN KEY ("daily_report_id") REFERENCES "public"."daily_reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_report_edit_logs" ADD CONSTRAINT "daily_report_edit_logs_edited_by_users_id_fk" FOREIGN KEY ("edited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_shift_id_shifts_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_company_id_snapshot_companies_id_fk" FOREIGN KEY ("company_id_snapshot") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_company_assignments" ADD CONSTRAINT "driver_company_assignments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_company_assignments" ADD CONSTRAINT "driver_company_assignments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_company_assignments" ADD CONSTRAINT "driver_company_assignments_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_company_assignments" ADD CONSTRAINT "project_company_assignments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_company_assignments" ADD CONSTRAINT "project_company_assignments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_company_assignments" ADD CONSTRAINT "project_company_assignments_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_current_owner_company_id_companies_id_fk" FOREIGN KEY ("current_owner_company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_confirmed_by_users_id_fk" FOREIGN KEY ("confirmed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_consents" ADD CONSTRAINT "system_consents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_auth_credentials" ADD CONSTRAINT "user_auth_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_current_company_id_companies_id_fk" FOREIGN KEY ("current_company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_main_project_id_projects_id_fk" FOREIGN KEY ("main_project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_default_vehicle_id_vehicles_id_fk" FOREIGN KEY ("default_vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_owner_company_id_companies_id_fk" FOREIGN KEY ("owner_company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_records" ADD CONSTRAINT "work_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_records" ADD CONSTRAINT "work_records_shift_id_shifts_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_records" ADD CONSTRAINT "work_records_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_aal_admin_time" ON "admin_action_logs" USING btree ("admin_user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_aal_target" ON "admin_action_logs" USING btree ("target_table","target_id");--> statement-breakpoint
CREATE INDEX "idx_companies_parent" ON "companies" USING btree ("parent_company_id");--> statement-breakpoint
CREATE INDEX "idx_dra_report_kind" ON "daily_report_attachments" USING btree ("daily_report_id","kind");--> statement-breakpoint
CREATE INDEX "idx_dra_expires" ON "daily_report_attachments" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_drel_report_time" ON "daily_report_edit_logs" USING btree ("daily_report_id","edited_at");--> statement-breakpoint
CREATE INDEX "idx_daily_reports_date_alert" ON "daily_reports" USING btree ("target_date","is_alert");--> statement-breakpoint
CREATE INDEX "idx_daily_reports_company_date" ON "daily_reports" USING btree ("company_id_snapshot","target_date");--> statement-breakpoint
CREATE INDEX "idx_daily_reports_user_date" ON "daily_reports" USING btree ("user_id","target_date");--> statement-breakpoint
CREATE INDEX "idx_dca_user_period" ON "driver_company_assignments" USING btree ("user_id","valid_from","valid_to");--> statement-breakpoint
CREATE INDEX "idx_dca_company_period" ON "driver_company_assignments" USING btree ("company_id","valid_from");--> statement-breakpoint
CREATE INDEX "idx_pca_project_period" ON "project_company_assignments" USING btree ("project_id","valid_from","valid_to");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_shifts_user_date_start" ON "shifts" USING btree ("user_id","scheduled_date","start_at");--> statement-breakpoint
CREATE INDEX "idx_shifts_date_status" ON "shifts" USING btree ("scheduled_date","status");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_sc_user_doc_version" ON "system_consents" USING btree ("user_id","document_type","document_version");--> statement-breakpoint
CREATE INDEX "idx_users_line_user_id" ON "users" USING btree ("line_user_id");--> statement-breakpoint
CREATE INDEX "idx_users_company_status" ON "users" USING btree ("current_company_id","status");--> statement-breakpoint
CREATE INDEX "idx_vehicles_inspection" ON "vehicles" USING btree ("inspection_expiry_date");--> statement-breakpoint
CREATE INDEX "idx_work_records_user_date" ON "work_records" USING btree ("user_id","target_date");