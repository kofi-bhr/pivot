import Layout from '@/components/layout/Layout';

export default function About() {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero section */}
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20">
          <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:px-8 lg:py-40">
            <div className="mx-auto max-w-2xl">
              <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                About PIVOT
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                PIVOT (Policy Insights and Voices of Tomorrow) is a novel non-profit that transforms high school students into published political analysts. Everyone has opinions, so why not make them heard?
              </p>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                In an era of toxic political division, PIVOT stands as a powerful counterforce. We don&apos;t just publish student opinions—we&apos;re cultivating the next generation of policy insights that cut through polarizing noise with clarity and conviction.
              </p>
            </div>
          </div>
        </div>

        {/* What We Deliver section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What PIVOT Delivers</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We&apos;re not just publishing articles: we are building tomorrow&apos;s political landscape.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div>
              <dt className="font-semibold text-gray-900">A Prestigious Publishing Platform</dt>
              <dd className="mt-1 text-gray-600">
                Exclusively for high school policy thinkers, providing a space where young voices can be heard beyond classroom walls.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Rigorous Editorial Mentorship</dt>
              <dd className="mt-1 text-gray-600">
                We demand excellence from our contributors, providing guidance that helps develop their analytical skills and political voice.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Direct Engagement with Challenging Viewpoints</dt>
              <dd className="mt-1 text-gray-600">
                We encourage our contributors to engage with diverse political perspectives, fostering a culture of respectful dialogue.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Access to a Network</dt>
              <dd className="mt-1 text-gray-600">
                Connect with ambitious, politically-engaged peers who share your passion for policy and public discourse.
              </dd>
            </div>
          </dl>
        </div>

        {/* Mission section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
            <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
              <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                <p className="text-xl leading-8 text-gray-600">
                  At PIVOT, we believe in the power of young voices to shape the political landscape. We&apos;re redefining youth engagement in politics by:
                </p>
                <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
                  <ul role="list" className="mt-8 space-y-8 text-gray-600">
                    <li className="flex gap-x-3">
                      <span>• Transforming high school students into published political analysts</span>
                    </li>
                    <li className="flex gap-x-3">
                      <span>• Cultivating the next generation of policy insights</span>
                    </li>
                    <li className="flex gap-x-3">
                      <span>• Cutting through polarizing noise with clarity and conviction</span>
                    </li>
                    <li className="flex gap-x-3">
                      <span>• Building a community of ambitious, politically-engaged young thinkers</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Get Involved section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 pb-32 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Get Involved</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Are you a high schooler or college student ready to make your voice heard beyond classroom walls? Do you lead an organization of young political thinkers? PIVOT is actively seeking bold voices and strategic partners.
            </p>
            <div className="mt-10">
              <a
                href="#"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Join PIVOT
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
