import Layout from '@/components/layout/Layout';
import Link from 'next/link';

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
                PIVOT is a youth-led think tank, focusing on amplifying young voices in the policymaking process in two main ways. Through PIVOT Voices, youth are given a platform to publish op-eds, articles, and research papers on issues they feel passionately about. Through the PIVOT Fellowship, we empower young leaders to design original, solutions-focused policy briefs and equip them with the skills needed to share their ideas with real-world changemakers.
              </p>
            </div>
          </div>
        </div>

        {/* Programs section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Programs</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We offer two main programs to amplify youth voices in policymaking:
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div>
              <dt className="font-semibold text-gray-900">PIVOT Voices</dt>
              <dd className="mt-1 text-gray-600">
                A platform for youth to publish op-eds, articles, and research papers on issues they feel passionately about.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">PIVOT Fellowship</dt>
              <dd className="mt-1 text-gray-600">
                A program empowering young leaders to design original, solutions-focused policy briefs and equipping them with the skills needed to share their ideas with real-world changemakers.
              </dd>
            </div>
          </dl>
        </div>

        {/* Get Involved section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 pb-32 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Get Involved</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Are you a high schooler or college student ready to make your voice heard beyond classroom walls? Are you interested in joining a global network of youth to address the world&apos;s most pressing challenges? Do you lead an organization with similar values and goals?
            </p>
            <div className="mt-10">
              <Link
                href="/get-involved"
                className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500"
              >
                Join us today <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
