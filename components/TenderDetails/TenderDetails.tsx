import * as React from "react";
import { Timeline } from "./components/Timeline";
import { Lot } from "./components/Lot";
import { ContractSummary } from "./components/ContractSummary";
import { BuyerInfo } from "./components/BuyerInfo";
import { Sidebar } from "../shared/Sidebar";

const timelineData = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/446ccb2b086ec643cf1bad459edac9161265bb0daf59c5590c144a45784c07e3?apiKey=27ce83af570848e9b22665bc31a03bc0&",
    title: "Posted",
    date: "Nov 7, 2024, 2:00 AM GMT+2"
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/446ccb2b086ec643cf1bad459edac9161265bb0daf59c5590c144a45784c07e3?apiKey=27ce83af570848e9b22665bc31a03bc0&",
    title: "Submission Date",
    date: "Nov 17, 2024, 2:00 AM GMT+2"
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/446ccb2b086ec643cf1bad459edac9161265bb0daf59c5590c144a45784c07e3?apiKey=27ce83af570848e9b22665bc31a03bc0&",
    title: "Due",
    date: "10 days"
  }
];

const lotsData = [
  {
    number: 1,
    title: "Corporate Tax Compliance",
    description: "Ensure accurate reporting and compliance with corporate tax regulations."
  },
  {
    number: 2,
    title: "VAT Advisory",
    description: "Provide expertise on VAT regulations, filings, and compliance."
  },
  {
    number: 3,
    title: "Transfer Pricing Audit",
    description: "Conduct a thorough transfer pricing audit and recommendations."
  },
  {
    number: 4,
    title: "International Tax Advisory",
    description: "Consult on cross-border tax issues, including compliance with international tax laws.",
    isExpanded: true,
    status: "Awarded",
    procurementType: "Advisory Services",
    estimatedValue: "€5.000",
    duration: "4 months"
  }
];

const contractSummaryData = {
  location: "Ireland",
  lots: 4,
  value: "€8.5M",
  status: "Open",
  submissionUrl: "https://uk.eu-supply.com/app/rfq/rwlentrance_s.asp?PID=87467&B=UK"
};

const buyerInfoData = {
  name: "Wade Warren",
  address: "2A Derwent Avenue Manchester M21 7QP,UK",
  phone: "+44 1614475160",
  email: "wade.warren@example.com",
  website: "http://www.faxquote.com"
};

export const TenderDetails: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-[312px] max-md:ml-0">
          <div className="flex flex-col w-full">
            <header className="flex flex-wrap gap-1 justify-center items-center p-2 w-full text-base font-medium text-indigo-700 bg-indigo-50">
              <div className="self-stretch my-auto">
                You have <span className="font-semibold text-indigo-700">6</span> days
                left of your free trial!
              </div>
              <a href="#" className="gap-2 self-stretch my-auto underline decoration-auto decoration-solid underline-offset-auto">
                Upgrade here
              </a>
            </header>

            <nav aria-label="Breadcrumb" className="flex gap-2 items-center self-start mt-6 ml-6 text-sm leading-none bg-white max-md:ml-2.5">
              <div className="self-stretch my-auto font-medium whitespace-nowrap text-neutral-600">
                Home
              </div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/dba9866dc16385808ab5d2c0084659378401e385d4d70b025461b326918bf618?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                alt=""
                className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
              />
              <div className="self-stretch my-auto font-semibold min-w-[240px] text-neutral-950">
                Vehicle Fleet Management Services
              </div>
            </nav>

            <section className="flex flex-wrap gap-7 justify-between items-start p-6 w-full bg-white max-md:px-5 max-md:max-w-full">
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col justify-center max-w-[649px]">
                  <h1 className="text-2xl font-semibold text-neutral-950">
                    Vehicle Fleet Management Services
                  </h1>
                  <div className="flex gap-4 items-start self-start mt-4 text-xs font-medium leading-loose text-zinc-800">
                    <div className="gap-2 self-stretch px-2 py-1 text-emerald-600 bg-indigo-50 rounded border border-indigo-600 border-solid min-h-[26px]">
                      75% Match
                    </div>
                    <div className="gap-2 self-stretch px-2 py-1 whitespace-nowrap rounded border border-solid border-zinc-300 min-h-[26px]">
                      €8.5M
                    </div>
                    <div className="flex gap-2 items-center px-2 py-1 whitespace-nowrap rounded border border-solid border-zinc-300 min-h-[26px]">
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/1e73f3384662b9bd545affdf49bcb5f218534a296ee473890d515079bada9aae?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                        alt="Ireland flag"
                        className="object-contain shrink-0 self-stretch my-auto aspect-[1.29] w-[18px]"
                      />
                      <div className="self-stretch my-auto">Ireland</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center text-sm">
                  <button className="flex overflow-hidden gap-2 items-center self-stretch h-full leading-none text-neutral-950">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/9fb5aa1da55802f5907ee07448f531bff1b06f50ebf3e446efbc5e577f9cb97b?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                      alt=""
                      className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                    />
                    <span className="self-stretch my-auto">Bid Submitted</span>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/16945e6630d6bd7aa37ef74f5e07f7c47910c9b5367a25462f3e7f21355cbe89?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                      alt=""
                      className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
                    />
                  </button>
                  <button className="gap-2 self-stretch py-1.5 pr-2.5 pl-2.5 my-auto text-center rounded-lg border border-solid border-zinc-300 text-zinc-800 w-[123px]">
                    Download PDF
                  </button>
                  <button className="flex gap-1.5 justify-center items-center self-stretch px-4 py-1.5 my-auto font-semibold text-center text-indigo-700 whitespace-nowrap bg-white rounded-lg border border-indigo-700 border-solid w-[98px]">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/b8dc9f27b9c1b6675ba8db9fc0a9742daf6f75a9ba1a3fe27bd3ec30efbced76?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                      alt=""
                      className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                    />
                    <span className="self-stretch my-auto">Like</span>
                  </button>
                </div>
              </div>
            </section>

            <section className="flex flex-col px-6 pb-6 w-full max-md:px-5 max-md:max-w-full">
              <div className="flex flex-col w-full text-neutral-950 max-md:max-w-full">
                <h2 className="text-xl font-semibold max-md:max-w-full">Description</h2>
                <p className="p-6 mt-4 w-full text-base leading-6 rounded-lg border border-solid border-zinc-300 max-md:px-5 max-md:max-w-full">
                  Tax return preparation and tax advisory services for Great
                  Places Housing Group (GPHG). The provider must prepare and
                  submit where applicable tax computations, tax notes for our
                  financial statements, tax returns and iXBRL versions of our
                  financial statements for the five separate organisations.
                </p>
              </div>

              <div className="flex flex-wrap gap-6 items-center mt-8 w-full max-md:max-w-full">
                <section className="flex flex-col grow shrink self-stretch my-auto min-w-[240px] w-[422px] max-md:max-w-full">
                  <h2 className="text-xl font-semibold text-neutral-950 max-md:max-w-full">
                    Contract summary
                  </h2>
                  <ContractSummary data={contractSummaryData} />
                </section>

                <section className="flex flex-col grow shrink self-stretch my-auto min-w-[240px] w-[422px] max-md:max-w-full">
                  <h2 className="text-xl font-semibold text-neutral-950 max-md:max-w-full">
                    Timeline
                  </h2>
                  <div className="flex flex-col justify-center items-start p-6 mt-4 w-full rounded-lg border border-solid border-stone-300 min-h-[296px] max-md:px-5 max-md:max-w-full">
                    <Timeline items={timelineData} />
                  </div>
                </section>
              </div>

              <section className="flex flex-col mt-8 w-full max-md:max-w-full">
                <h2 className="text-xl font-semibold text-neutral-950 max-md:max-w-full">
                  About the buyer
                </h2>
                <BuyerInfo data={buyerInfoData} />
              </section>

              <section className="flex flex-col mt-8 w-full max-md:max-w-full">
                <h2 className="text-xl font-semibold text-neutral-950 max-md:max-w-full">
                  Lots
                </h2>
                <div className="flex flex-col mt-4 w-full text-base max-md:max-w-full">
                  {lotsData.map((lot, index) => (
                    <div key={index} className={index > 0 ? "mt-6" : ""}>
                      <Lot lot={lot} />
                    </div>
                  ))}
                </div>
              </section>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};