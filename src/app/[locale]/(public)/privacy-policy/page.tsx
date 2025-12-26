import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("PrivacyPolicy");
  return {
    title: t("title"),
    description: t("introductionDesc"),
  };
}

export default function PrivacyPolicyPage() {
  const t = useTranslations("PrivacyPolicy");

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

            <h2 className="text-xl font-semibold mt-8">
              {t("infoWeCollectTitle")}
            </h2>
            <p>{t("infoWeCollectDesc")}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>{t("identityData")}</strong>
              </li>
              <li>
                <strong>{t("contactData")}</strong>
              </li>
              <li>
                <strong>{t("financialData")}</strong>
              </li>
              <li>
                <strong>{t("transactionData")}</strong>
              </li>
              <li>
                <strong>{t("technicalData")}</strong>
              </li>
              <li>
                <strong>{t("profileData")}</strong>
              </li>
              <li>
                <strong>{t("usageData")}</strong>
              </li>
              <li>
                <strong>{t("marketingData")}</strong>
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8">{t("howWeUseTitle")}</h2>
            <p>{t("howWeUseDesc")}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t("contractUse")}</li>
              <li>{t("legalUse")}</li>
              <li>{t("legitimateUse")}</li>
              <li>{t("consentUse")}</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8">{t("cookiesTitle")}</h2>
            <p>{t("cookiesDesc")}</p>

            <h2 className="text-xl font-semibold mt-8">
              {t("dataSecurityTitle")}
            </h2>
            <p>{t("dataSecurityDesc")}</p>

            <h2 className="text-xl font-semibold mt-8">
              {t("dataRetentionTitle")}
            </h2>
            <p>{t("dataRetentionDesc")}</p>

            <h2 className="text-xl font-semibold mt-8">
              {t("legalRightsTitle")}
            </h2>
            <p>{t("legalRightsDesc")}</p>

            <h2 className="text-xl font-semibold mt-8">{t("contactTitle")}</h2>
            <p>{t("contactDesc")}</p>
            <p className="mt-2">
              Email: privacy@restaurant.com
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
