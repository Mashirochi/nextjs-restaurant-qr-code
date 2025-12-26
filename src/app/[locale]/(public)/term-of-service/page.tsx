import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("TermsOfService");
  return {
    title: t("title"),
    description: t("introductionDesc"),
  };
}

export default function TermsOfServicePage() {
  const t = useTranslations("TermsOfService");

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-lg text-muted-foreground">{t("lastUpdated")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("introductionTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>{t("introductionDesc")}</p>
            <p>{t("introductionAgreement")}</p>

            <h2 className="text-xl font-semibold mt-8">
              {t("useOfServicesTitle")}
            </h2>
            <p>{t("useOfServicesDesc")}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t("useOfServicesViolate")}</li>
              <li>{t("useOfServicesInfringe")}</li>
              <li>{t("useOfServicesHarmful")}</li>
              <li>{t("useOfServicesUnauthorized")}</li>
              <li>{t("useOfServicesInterfere")}</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8">{t("accountsTitle")}</h2>
            <p>{t("accountsDesc")}</p>

            <h2 className="text-xl font-semibold mt-8">
              {t("ordersAndPaymentsTitle")}
            </h2>
            <p>{t("ordersAndPaymentsDesc")}</p>
            <p>{t("ordersAndPaymentsCharges")}</p>

            <h2 className="text-xl font-semibold mt-8">
              {t("intellectualPropertyTitle")}
            </h2>
            <p>{t("intellectualPropertyDesc")}</p>

            <h2 className="text-xl font-semibold mt-8">
              {t("limitationOfLiabilityTitle")}
            </h2>
            <p>{t("limitationOfLiabilityDesc")}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t("limitationOfLiabilityAccess")}</li>
              <li>{t("limitationOfLiabilityConduct")}</li>
              <li>{t("limitationOfLiabilityContent")}</li>
              <li>{t("limitationOfLiabilityUnauthorized")}</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8">
              {t("modificationsToServicesTitle")}
            </h2>
            <p>{t("modificationsToServicesDesc")}</p>

            <h2 className="text-xl font-semibold mt-8">
              {t("governingLawTitle")}
            </h2>
            <p>{t("governingLawDesc")}</p>

            <h2 className="text-xl font-semibold mt-8">
              {t("changesToTermsTitle")}
            </h2>
            <p>{t("changesToTermsDesc")}</p>

            <h2 className="text-xl font-semibold mt-8">
              {t("contactUsTitle")}
            </h2>
            <p>{t("contactUsDesc")}</p>
            <p className="mt-2">
              Email: terms@restaurant.com
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
