import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Our Restaurant</h1>
          <p className="text-lg text-muted-foreground">
            Discover our story, passion, and commitment to culinary excellence
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Founded with a passion for authentic flavors and exceptional
                dining experiences, our restaurant has been serving the
                community for over a decade. What started as a small
                family-owned establishment has grown into a beloved local
                favorite.
              </p>
              <p>
                Our journey began with a simple mission: to bring people
                together through delicious food, warm hospitality, and memorable
                experiences. Every dish we serve tells a story of tradition,
                innovation, and dedication to quality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Philosophy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We believe that great food is more than just ingredients—it's
                about passion, craftsmanship, and respect for tradition. Our
                chefs combine time-honored techniques with modern innovation to
                create dishes that delight the senses.
              </p>
              <p>
                Sustainability and community are at the heart of everything we
                do. We source locally whenever possible, support regional
                farmers and producers, and strive to minimize our environmental
                impact.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Meet Our Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👨‍🍳</span>
                </div>
                <h3 className="text-xl font-semibold">Chef Executive</h3>
                <p className="text-muted-foreground">Master of Culinary Arts</p>
                <p className="mt-2 text-sm">
                  With over 20 years of experience, our executive chef brings
                  creativity and expertise to every dish.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👩‍💼</span>
                </div>
                <h3 className="text-xl font-semibold">General Manager</h3>
                <p className="text-muted-foreground">Hospitality Expert</p>
                <p className="mt-2 text-sm">
                  Ensuring every guest has an exceptional experience is our
                  manager's top priority.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👩‍🍳</span>
                </div>
                <h3 className="text-xl font-semibold">Pastry Chef</h3>
                <p className="text-muted-foreground">
                  Sweet Creations Specialist
                </p>
                <p className="mt-2 text-sm">
                  Our pastry chef transforms simple ingredients into
                  extraordinary desserts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Our Commitment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Quality Ingredients
                </h3>
                <p>
                  We source the finest ingredients from trusted suppliers and
                  local farms. Our commitment to quality means we never
                  compromise on freshness or flavor.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Exceptional Service
                </h3>
                <p>
                  Our staff is trained to provide attentive, personalized
                  service that makes every guest feel welcome and valued.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Community Engagement
                </h3>
                <p>
                  We actively participate in local events and support community
                  initiatives, believing that a strong restaurant is part of a
                  strong community.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Continuous Innovation
                </h3>
                <p>
                  While honoring traditional recipes, we constantly explore new
                  flavors and techniques to keep our menu exciting and fresh.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Visit Us Today</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Experience the perfect blend of tradition and innovation. Join us
            for an unforgettable culinary journey that celebrates the best of
            local flavors and international cuisine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/menu">View Our Menu</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
