import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import TicketForm from "@/feature/manage/ticket/ticket.form";
import TicketTreeTable from "@/feature/manage/ticket/ticket.tree.table";
import LetterTable from "@/feature/manage/ticket/letter.table";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Ticket" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function TicketPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = useTranslations("Ticket");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-lg border mb-8">
            <h2 className="text-xl font-semibold mb-4">{t("sectionTitle")}</h2>
            <p className="mb-6">{t("content")}</p>
            <TicketForm
              emailLabel={t("emailLabel")}
              emailPlaceholder={t("emailPlaceholder")}
              contentLabel={t("contentLabel")}
              contentPlaceholder={t("contentPlaceholder")}
              imageUploadLabel={t("imageUploadLabel")}
              submitLabel={t("submit")}
            />
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">{t("treeTitle")}</h2>
            <TicketTreeTable
              idLabel={t("id")}
              dateLabel={t("date")}
              performedByLabel={t("performedBy")}
              notesLabel={t("notes")}
              noTicketsLabel={t("noTickets")}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">
              {t("letter", { defaultValue: "Letter List" })}
            </h2>
            <LetterTable
              idLabel={t("id", { ns: "Letter" })}
              titleLabel={t("titleColumn", { ns: "Letter" })}
              linkLabel={t("link", { ns: "Letter" })}
              noLettersLabel={t("noLetters", { ns: "Letter" })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
