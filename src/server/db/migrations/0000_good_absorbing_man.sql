CREATE TABLE IF NOT EXISTS "gain-tracker_exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(255) NOT NULL,
	"description" varchar(500)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gain-tracker_image" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"url" varchar(256) NOT NULL,
	"user_id" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gain-tracker_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "gain-tracker_users_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "gain-tracker_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gain-tracker_workouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"user_avatar" varchar(255),
	"date" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"exercise_id" integer NOT NULL,
	"exercise_name" varchar(255) NOT NULL,
	"weight" integer NOT NULL,
	"sets" integer NOT NULL,
	"reps" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gain-tracker_workouts_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"workout_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"exercise_id" integer NOT NULL,
	"exercise_name" varchar(255) NOT NULL,
	"weight" integer NOT NULL,
	"sets" integer NOT NULL,
	"reps" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gain-tracker_image" ADD CONSTRAINT "gain-tracker_image_user_id_gain-tracker_users_clerk_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."gain-tracker_users"("clerk_user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gain-tracker_workouts" ADD CONSTRAINT "gain-tracker_workouts_user_id_gain-tracker_users_clerk_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."gain-tracker_users"("clerk_user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gain-tracker_workouts" ADD CONSTRAINT "gain-tracker_workouts_exercise_id_gain-tracker_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."gain-tracker_exercises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gain-tracker_workouts_history" ADD CONSTRAINT "gain-tracker_workouts_history_workout_id_gain-tracker_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."gain-tracker_workouts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gain-tracker_workouts_history" ADD CONSTRAINT "gain-tracker_workouts_history_user_id_gain-tracker_users_clerk_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."gain-tracker_users"("clerk_user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gain-tracker_workouts_history" ADD CONSTRAINT "gain-tracker_workouts_history_exercise_id_gain-tracker_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."gain-tracker_exercises"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
