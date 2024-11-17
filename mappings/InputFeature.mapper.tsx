import { figmaMapping, type BaseFigmaProps } from "@builder.io/dev-tools/figma";
import { InputField } from "@/components/CompanySetup/InputField";

// ❖ Input Feature
interface FigmaInputFeatureProps extends BaseFigmaProps {}

// Read more at https://www.builder.io/c/docs/mapping-functions
figmaMapping({
  componentKey: "3490dc7bf02be4c9e5384223abd92b1c3b0fe10a",
  mapper(figma: FigmaInputFeatureProps) {
    return <InputField label="" placeholder="" value="" />;
  },
});
