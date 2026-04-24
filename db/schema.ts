import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  smallint,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    parentCompanyId: uuid("parent_company_id").references(
      (): AnyPgColumn => companies.id,
    ),
    tierLevel: smallint("tier_level").notNull(),
    representative: varchar("representative", { length: 50 }),
    email: varchar("email", { length: 254 }),
    phoneNumber: varchar("phone_number", { length: 15 }),
    isActive: smallint("is_active").notNull().default(1),
    retiredAt: timestamp("retired_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_companies_parent").on(table.parentCompanyId)],
);

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  type: smallint("type").notNull(),
  defaultStartTime: time("default_start_time"),
  defaultEndTime: time("default_end_time"),
  pickupLocation: varchar("pickup_location", { length: 100 }).notNull(),
  deliveryLocation: varchar("delivery_location", { length: 100 }).notNull(),
  restLocations: jsonb("rest_locations"),
  logoUrl: text("logo_url"),
  unitPrice: integer("unit_price"),
  currentOwnerCompanyId: uuid("current_owner_company_id").references(
    () => companies.id,
  ),
  isActive: smallint("is_active").notNull().default(1),
  retiredAt: timestamp("retired_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lineUserId: varchar("line_user_id", { length: 64 }).unique(),
    email: varchar("email", { length: 254 }).unique(),
    name: varchar("name", { length: 50 }).notNull(),
    birthDate: date("birth_date").notNull(),
    phoneNumber: varchar("phone_number", { length: 15 }).notNull(),
    role: smallint("role").notNull().default(0),
    status: smallint("status").notNull().default(0),
    selfReportedCompanyName: varchar("self_reported_company_name", {
      length: 100,
    }),
    selfReportedVehicleNo: varchar("self_reported_vehicle_no", { length: 20 }),
    selfReportedAt: timestamp("self_reported_at", { withTimezone: true }),
    currentCompanyId: uuid("current_company_id").references(() => companies.id),
    mainProjectId: uuid("main_project_id").references(() => projects.id),
    defaultVehicleId: uuid("default_vehicle_id").references(
      (): AnyPgColumn => vehicles.id,
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_users_line_user_id").on(table.lineUserId),
    index("idx_users_company_status").on(table.currentCompanyId, table.status),
  ],
);

export const userAuthCredentials = pgTable("user_auth_credentials", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  passwordChangedAt: timestamp("password_changed_at", {
    withTimezone: true,
  }).notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  lastLoginIp: varchar("last_login_ip", { length: 45 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const vehicles = pgTable(
  "vehicles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    plateNumber: varchar("plate_number", { length: 20 }).notNull().unique(),
    name: varchar("name", { length: 50 }),
    ownershipType: smallint("ownership_type").notNull(),
    ownerCompanyId: uuid("owner_company_id").references(() => companies.id),
    ownerUserId: uuid("owner_user_id").references(() => users.id),
    inspectionExpiryDate: date("inspection_expiry_date"),
    isActive: smallint("is_active").notNull().default(1),
    retiredAt: timestamp("retired_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_vehicles_inspection").on(table.inspectionExpiryDate),
    check(
      "vehicles_ownership_exclusive",
      sql`(${table.ownershipType} = 0 AND ${table.ownerCompanyId} IS NOT NULL AND ${table.ownerUserId} IS NULL)
         OR (${table.ownershipType} = 1 AND ${table.ownerUserId} IS NOT NULL AND ${table.ownerCompanyId} IS NULL)`,
    ),
  ],
);

export const driverCompanyAssignments = pgTable(
  "driver_company_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id),
    validFrom: date("valid_from").notNull(),
    validTo: date("valid_to"),
    reason: text("reason"),
    changedBy: uuid("changed_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_dca_user_period").on(
      table.userId,
      table.validFrom,
      table.validTo,
    ),
    index("idx_dca_company_period").on(table.companyId, table.validFrom),
  ],
);

export const projectCompanyAssignments = pgTable(
  "project_company_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id),
    validFrom: date("valid_from").notNull(),
    validTo: date("valid_to"),
    reason: text("reason"),
    changedBy: uuid("changed_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_pca_project_period").on(
      table.projectId,
      table.validFrom,
      table.validTo,
    ),
  ],
);

export const shifts = pgTable(
  "shifts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    scheduledDate: date("scheduled_date").notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    vehicleId: uuid("vehicle_id").references(() => vehicles.id),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }),
    note: text("note"),
    status: smallint("status").notNull(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),
    confirmedBy: uuid("confirmed_by").references(() => users.id),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("idx_shifts_user_date_start").on(
      table.userId,
      table.scheduledDate,
      table.startAt,
    ),
    index("idx_shifts_date_status").on(table.scheduledDate, table.status),
    check(
      "shifts_end_after_start",
      sql`${table.endAt} IS NULL OR ${table.endAt} > ${table.startAt}`,
    ),
    check(
      "shifts_confirmed_has_approver",
      sql`${table.status} <> 1 OR (${table.confirmedBy} IS NOT NULL AND ${table.confirmedAt} IS NOT NULL)`,
    ),
  ],
);

export const dailyReports = pgTable(
  "daily_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    shiftId: uuid("shift_id")
      .notNull()
      .unique()
      .references(() => shifts.id),
    targetDate: date("target_date").notNull(),
    vehicleId: uuid("vehicle_id")
      .notNull()
      .references(() => vehicles.id),

    lineUserIdSnapshot: varchar("line_user_id_snapshot", { length: 64 }),
    companyIdSnapshot: uuid("company_id_snapshot")
      .notNull()
      .references(() => companies.id),

    startReportedAt: timestamp("start_reported_at", { withTimezone: true }),
    startInspectorType: smallint("start_inspector_type"),
    startInspectorName: varchar("start_inspector_name", { length: 50 }),
    startInspectionMethod: smallint("start_inspection_method"),
    startInspectionMethodNote: text("start_inspection_method_note"),
    startLicenseConfirmed: smallint("start_license_confirmed"),
    startHealthStatus: smallint("start_health_status"),
    startVehicleCheckStatus: smallint("start_vehicle_check_status"),
    startVehicleCheckDetails: jsonb("start_vehicle_check_details"),
    startAlcoholUsed: smallint("start_alcohol_used"),
    startAlcoholValue: numeric("start_alcohol_value", {
      precision: 3,
      scale: 2,
    }),
    startAlcoholStatus: smallint("start_alcohol_status"),
    startOdometer: integer("start_odometer"),
    startLocation: jsonb("start_location"),
    startMessage: text("start_message"),

    endReportedAt: timestamp("end_reported_at", { withTimezone: true }),
    endInspectorType: smallint("end_inspector_type"),
    endInspectorName: varchar("end_inspector_name", { length: 50 }),
    endInspectionMethod: smallint("end_inspection_method"),
    endInspectionMethodNote: text("end_inspection_method_note"),
    endAlcoholUsed: smallint("end_alcohol_used"),
    endAlcoholValue: numeric("end_alcohol_value", { precision: 3, scale: 2 }),
    endAlcoholStatus: smallint("end_alcohol_status"),
    endOdometer: integer("end_odometer"),
    endStatusReportType: smallint("end_status_report_type"),
    endStatusReportNote: text("end_status_report_note"),
    endHandoverType: smallint("end_handover_type"),
    endHandoverNote: text("end_handover_note"),
    endRestLocation: text("end_rest_location"),
    endLocation: jsonb("end_location"),
    endMessage: text("end_message"),

    drivingDistanceKm: integer("driving_distance_km").generatedAlwaysAs(
      sql`end_odometer - start_odometer`,
    ),

    isAlert: smallint("is_alert").notNull().default(0),
    alertReasons: jsonb("alert_reasons"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_daily_reports_date_alert").on(table.targetDate, table.isAlert),
    index("idx_daily_reports_company_date").on(
      table.companyIdSnapshot,
      table.targetDate,
    ),
    index("idx_daily_reports_user_date").on(table.userId, table.targetDate),
    check(
      "daily_reports_end_rest_required",
      sql`${table.endReportedAt} IS NULL OR ${table.endRestLocation} IS NOT NULL`,
    ),
  ],
);

export const workRecords = pgTable(
  "work_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    shiftId: uuid("shift_id")
      .notNull()
      .unique()
      .references(() => shifts.id),
    targetDate: date("target_date").notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    breakTimeMin: integer("break_time_min"),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_work_records_user_date").on(table.userId, table.targetDate),
    check(
      "work_records_ended_after_started",
      sql`${table.endedAt} IS NULL OR ${table.endedAt} > ${table.startedAt}`,
    ),
  ],
);

export const dailyReportAttachments = pgTable(
  "daily_report_attachments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    dailyReportId: uuid("daily_report_id")
      .notNull()
      .references(() => dailyReports.id),
    kind: smallint("kind").notNull(),
    blobUrl: text("blob_url").notNull(),
    blobPathname: text("blob_pathname").notNull(),
    fileSize: integer("file_size").notNull(),
    mimeType: varchar("mime_type", { length: 64 }).notNull(),
    width: integer("width"),
    height: integer("height"),
    takenAt: timestamp("taken_at", { withTimezone: true }),
    captureMethod: smallint("capture_method").notNull(),
    uploadedBy: uuid("uploaded_by")
      .notNull()
      .references(() => users.id),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_dra_report_kind").on(table.dailyReportId, table.kind),
    index("idx_dra_expires").on(table.expiresAt),
  ],
);

export const dailyReportEditLogs = pgTable(
  "daily_report_edit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    dailyReportId: uuid("daily_report_id")
      .notNull()
      .references(() => dailyReports.id),
    editedBy: uuid("edited_by")
      .notNull()
      .references(() => users.id),
    editReason: text("edit_reason").notNull(),
    fieldChanges: jsonb("field_changes").notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    editedAt: timestamp("edited_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_drel_report_time").on(table.dailyReportId, table.editedAt),
  ],
);

export const adminActionLogs = pgTable(
  "admin_action_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminUserId: uuid("admin_user_id")
      .notNull()
      .references(() => users.id),
    actionType: smallint("action_type").notNull(),
    targetTable: varchar("target_table", { length: 64 }).notNull(),
    targetId: uuid("target_id"),
    diff: jsonb("diff"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_aal_admin_time").on(table.adminUserId, table.createdAt),
    index("idx_aal_target").on(table.targetTable, table.targetId),
  ],
);

export const systemConsents = pgTable(
  "system_consents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    documentType: smallint("document_type").notNull(),
    documentVersion: varchar("document_version", { length: 16 }).notNull(),
    agreedAt: timestamp("agreed_at", { withTimezone: true }).notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
  },
  (table) => [
    uniqueIndex("idx_sc_user_doc_version").on(
      table.userId,
      table.documentType,
      table.documentVersion,
    ),
  ],
);
