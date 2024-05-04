-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Taxa" (
    "id" INTEGER NOT NULL,
    "scientificName" TEXT NOT NULL,
    "commonNames" JSONB NOT NULL DEFAULT '{}',
    "rank" TEXT NOT NULL,
    "rankLevel" INTEGER NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Taxa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" SERIAL NOT NULL,
    "sourceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "taxaId" INTEGER NOT NULL,
    "json" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxaMedia" (
    "id" SERIAL NOT NULL,
    "taxaId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "originalUrl" TEXT,
    "attribution" TEXT,
    "position" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaxaMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "commonNames" JSONB NOT NULL DEFAULT '{}',
    "subtitle" JSONB NOT NULL DEFAULT '{}',
    "level" INTEGER NOT NULL,
    "parentId" INTEGER,
    "speciesCount" INTEGER NOT NULL DEFAULT -1,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" SERIAL NOT NULL,
    "taxaId" INTEGER NOT NULL,
    "attributeDefinitionId" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeDefinition" (
    "id" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "valueType" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttributeDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" UUID,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListToSpecies" (
    "listId" INTEGER NOT NULL,
    "taxaId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListToSpecies_pkey" PRIMARY KEY ("listId","taxaId")
);

-- CreateTable
CREATE TABLE "_Ancestors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_GroupToHighLevelTaxa" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_GroupToHighlightedSpecies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Source_sourceId_name_context_taxaId_key" ON "Source"("sourceId", "name", "context", "taxaId");

-- CreateIndex
CREATE UNIQUE INDEX "TaxaMedia_taxaId_url_key" ON "TaxaMedia"("taxaId", "url");

-- CreateIndex
CREATE UNIQUE INDEX "Group_slug_key" ON "Group"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_taxaId_attributeDefinitionId_key" ON "Attribute"("taxaId", "attributeDefinitionId");

-- CreateIndex
CREATE UNIQUE INDEX "_Ancestors_AB_unique" ON "_Ancestors"("A", "B");

-- CreateIndex
CREATE INDEX "_Ancestors_B_index" ON "_Ancestors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToHighLevelTaxa_AB_unique" ON "_GroupToHighLevelTaxa"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToHighLevelTaxa_B_index" ON "_GroupToHighLevelTaxa"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToHighlightedSpecies_AB_unique" ON "_GroupToHighlightedSpecies"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToHighlightedSpecies_B_index" ON "_GroupToHighlightedSpecies"("B");

-- AddForeignKey
ALTER TABLE "Taxa" ADD CONSTRAINT "Taxa_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Taxa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_taxaId_fkey" FOREIGN KEY ("taxaId") REFERENCES "Taxa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxaMedia" ADD CONSTRAINT "TaxaMedia_taxaId_fkey" FOREIGN KEY ("taxaId") REFERENCES "Taxa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_taxaId_fkey" FOREIGN KEY ("taxaId") REFERENCES "Taxa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_attributeDefinitionId_fkey" FOREIGN KEY ("attributeDefinitionId") REFERENCES "AttributeDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListToSpecies" ADD CONSTRAINT "ListToSpecies_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListToSpecies" ADD CONSTRAINT "ListToSpecies_taxaId_fkey" FOREIGN KEY ("taxaId") REFERENCES "Taxa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Ancestors" ADD CONSTRAINT "_Ancestors_A_fkey" FOREIGN KEY ("A") REFERENCES "Taxa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Ancestors" ADD CONSTRAINT "_Ancestors_B_fkey" FOREIGN KEY ("B") REFERENCES "Taxa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToHighLevelTaxa" ADD CONSTRAINT "_GroupToHighLevelTaxa_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToHighLevelTaxa" ADD CONSTRAINT "_GroupToHighLevelTaxa_B_fkey" FOREIGN KEY ("B") REFERENCES "Taxa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToHighlightedSpecies" ADD CONSTRAINT "_GroupToHighlightedSpecies_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToHighlightedSpecies" ADD CONSTRAINT "_GroupToHighlightedSpecies_B_fkey" FOREIGN KEY ("B") REFERENCES "Taxa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
