-- CreateTable
CREATE TABLE "user_visits" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_visits_user_id_idx" ON "user_visits"("user_id");

-- CreateIndex
CREATE INDEX "user_visits_created_at_idx" ON "user_visits"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "user_visits" ADD CONSTRAINT "user_visits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
