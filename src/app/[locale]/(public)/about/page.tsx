import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("About");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-lg text-muted-foreground">{t("description")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t("ourStoryTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{t("ourStoryIntro")}</p>
              <p>{t("ourStoryMission")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {t("ourPhilosophyTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{t("ourPhilosophyIntro")}</p>
              <p>{t("ourPhilosophySustainability")}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">{t("meetOurTeamTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👨‍🍳</span>
                </div>
                <h3 className="text-xl font-semibold">{t("chefTitle")}</h3>
                <p className="text-muted-foreground">{t("chefSpecialty")}</p>
                <p className="mt-2 text-sm">{t("chefDescription")}</p>
              </div>

              <div className="text-center">
                <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👩‍💼</span>
                </div>
                <h3 className="text-xl font-semibold">{t("managerTitle")}</h3>
                <p className="text-muted-foreground">{t("managerSpecialty")}</p>
                <p className="mt-2 text-sm">{t("managerDescription")}</p>
              </div>

              <div className="text-center">
                <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👩‍🍳</span>
                </div>
                <h3 className="text-xl font-semibold">
                  {t("pastryChefTitle")}
                </h3>
                <p className="text-muted-foreground">
                  {t("pastryChefSpecialty")}
                </p>
                <p className="mt-2 text-sm">{t("pastryChefDescription")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">
              {t("ourCommitmentTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("qualityIngredientsTitle")}
                </h3>
                <p>{t("qualityIngredientsDesc")}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("exceptionalServiceTitle")}
                </h3>
                <p>{t("exceptionalServiceDesc")}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("communityEngagementTitle")}
                </h3>
                <p>{t("communityEngagementDesc")}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("continuousInnovationTitle")}
                </h3>
                <p>{t("continuousInnovationDesc")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">{t("visitUsTitle")}</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            {t("visitUsDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/menu">{t("viewMenu")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
