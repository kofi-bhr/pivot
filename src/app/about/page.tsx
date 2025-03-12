import Layout from '@/components/layout/Layout';
import Image from 'next/image';

export default function About() {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero section */}
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20">
          <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
              <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                About Pivot
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Pivot is a nonprofit organization dedicated to publishing thoughtful analysis and in-depth
                research on the most pressing issues of our time. Our mission is to foster informed dialogue and
                drive positive change through expert insights and evidence-based discourse.
              </p>
            </div>
            <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
              <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                <div className="relative aspect-[16/9] w-[37rem] rounded-xl bg-gray-50 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]">
                  <Image
                    src="/about-hero.jpg"
                    alt="About Pivot"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We believe in the power of thoughtful journalism and rigorous analysis to inform and inspire.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div>
              <dt className="font-semibold text-gray-900">Integrity</dt>
              <dd className="mt-1 text-gray-600">
                We maintain the highest standards of journalistic integrity, ensuring our reporting is accurate,
                fair, and transparent.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Independence</dt>
              <dd className="mt-1 text-gray-600">
                Our nonprofit status allows us to pursue stories that matter, free from commercial pressures
                and conflicts of interest.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Impact</dt>
              <dd className="mt-1 text-gray-600">
                We measure our success by the positive change our journalism creates in communities and institutions.
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
                  At Pivot, we believe that well-researched, thoughtful journalism is essential for a healthy democracy.
                  We work tirelessly to:
                </p>
                <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
                  <ul role="list" className="mt-8 space-y-8 text-gray-600">
                    <li className="flex gap-x-3">
                      <span>• Investigate complex issues with depth and nuance</span>
                    </li>
                    <li className="flex gap-x-3">
                      <span>• Amplify diverse voices and perspectives</span>
                    </li>
                    <li className="flex gap-x-3">
                      <span>• Foster constructive dialogue across different viewpoints</span>
                    </li>
                    <li className="flex gap-x-3">
                      <span>• Hold power to account through rigorous reporting</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Support Our Work</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              As a nonprofit organization, we rely on the support of readers like you to continue our important work.
              Your contribution helps us maintain our independence and pursue impactful journalism.
            </p>
            <div className="mt-10">
              <a
                href="#"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Donate Now
              </a>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 pb-32 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Have a tip, suggestion, or want to get in touch? We'd love to hear from you.
            </p>
            <dl className="mt-10 space-y-4 text-base leading-7 text-gray-600">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="font-semibold text-gray-900">Email:</span>
                </dt>
                <dd><a href="mailto:contact@pivot.org" className="text-blue-600 hover:text-blue-500">contact@pivot.org</a></dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="font-semibold text-gray-900">Address:</span>
                </dt>
                <dd>123 Journalism Street, Media City, ST 12345</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Layout>
  );
}
