import React from "react";

export const CompanyInfo: React.FC = () => {
  return (
    <div className="flex flex-col w-[31%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col grow justify-center self-stretch px-12 pt-12 pb-0 w-full bg-indigo-700 max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col flex-1 w-full">
          <div className="flex gap-2.5 w-full min-h-[36px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/268182aa23c8056e4ee4d1e36e59bc08ee3a77998fd48675e7ec0ffa43923c25?apiKey=27ce83af570848e9b22665bc31a03bc0&"
              alt="Company logo"
              className="object-contain aspect-[3] w-[108px]"
            />
          </div>
          <div className="flex overflow-hidden items-start p-8 mt-8 w-full bg-indigo-600 rounded-lg max-md:px-5">
            <div className="flex flex-col flex-1 shrink w-full basis-0 min-w-[240px]">
              <h2 className="w-full text-2xl font-semibold text-white">
                Why Skim?
              </h2>
              <ul className="flex flex-col mt-4 w-full">
                <li className="flex gap-2 items-center p-2 w-full text-base text-white">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/9ef31fea1aa958c7bfa076ef6c7336a039c1f745fc9e489d3a855ad3d1cfbdd9?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                    alt=""
                    className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                  />
                  <span className="self-stretch my-auto">
                    AI matchmaking service
                  </span>
                </li>
                <li className="flex gap-2 items-center p-2 mt-3.5 w-full text-base text-white">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/1f1a0ff2985b965734ca17c4fb46b708ea457a2b453f02f1e8c3021238024d42?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                    alt=""
                    className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                  />
                  <span className="self-stretch my-auto">
                    250,000 EU opportunities
                  </span>
                </li>
                <li className="flex gap-2 items-start p-2 mt-3.5 w-full">
                  <div className="flex gap-2.5 items-center pt-1 w-6">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/e8ed80088b86d4d605841f26ef9bbfef2062b8b5a8b79dc0de05d1420a1f1485?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                      alt=""
                      className="object-contain flex-1 shrink self-stretch my-auto w-6 aspect-square basis-0"
                    />
                  </div>
                  <span className="flex-1 shrink text-base leading-6 text-white basis-0">
                    New features daily from your feedback
                  </span>
                </li>
                <li className="flex gap-2 items-center p-2 mt-3.5 w-full text-base text-white">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/97fd5ccbf635928f544a9762e94f05815b2b6c0969498d95d323e2267a9a9de3?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                    alt=""
                    className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                  />
                  <span className="self-stretch my-auto">
                    Win more government tenders
                  </span>
                </li>
                <li className="flex gap-2 items-center p-2 mt-3.5 w-full text-base text-white">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/510a36ee51ae3a126fab252a0b6478c171730e1eb815043cc17fa51f0a3903b6?apiKey=27ce83af570848e9b22665bc31a03bc0&"
                    alt=""
                    className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                  />
                  <span className="self-stretch my-auto">
                    Generate more revenue
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
