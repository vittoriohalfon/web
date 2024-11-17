import { figmaMapping, type BaseFigmaProps } from "@builder.io/dev-tools/figma";
import { CompanyInfo } from "@/components/CompanySetup/CompanyInfo";

// ❖ Right Content
interface FigmaRightContentProps extends BaseFigmaProps {}

// Read more at https://www.builder.io/c/docs/mapping-functions
figmaMapping({
  componentKey: "394fa833535c52a14969158d359d2b77d8ffc082",
  mapper(figma: FigmaRightContentProps) {
    return <CompanyInfo />;
  },
});
