import { IImmutable } from 'shared/types/Immutable';
import { generateID } from 'shared/IDGenerator';
import { ClientTranslationSchema } from 'app/istore';
import { intersectionBy } from 'lodash';

type formDataType = {
  key: string;
  formID: string;
  hasUntranslatedValues: boolean;
  values: {
    locale: string;
    value: string;
  }[];
};

const prepareFormValues = (
  translations: IImmutable<ClientTranslationSchema[]>,
  context: string
) => {
  const contextTranslations = translations.toJS().map((translation: ClientTranslationSchema) => {
    const currentContext = translation.contexts?.filter(
      translationContext => translationContext?.id === context
    );
    return { ...translation, contexts: currentContext };
  });

  const contextTerms = Object.keys(contextTranslations[0].contexts[0].values).sort();

  const contextValues = contextTranslations.map((byLang: ClientTranslationSchema) => ({
    locale: byLang.locale,
    ...byLang?.contexts?.[0].values,
  }));

  const formData = contextTerms.map(contextTerm => {
    const hasUntranslatedValues =
      intersectionBy(contextValues, contextTerm).length < contextValues.length;
    return {
      key: contextTerm,
      formID: generateID(6, 6),
      hasUntranslatedValues,
      values: contextValues.map((val: { [x: string]: any; locale: any }) => ({
        locale: val.locale,
        value: val[contextTerm],
      })),
    };
  });

  return {
    contextLabel: contextTranslations[0].contexts[0].label,
    formData,
    contextTranslations,
  };
};

const prepareTranslationsToSave = (
  currentTranslations: ClientTranslationSchema[],
  formData: formDataType[]
): ClientTranslationSchema[] => {
  const preparedTranslations = currentTranslations.map(translation => {
    const { locale } = translation;
    const updatedContext = translation?.contexts?.map(context => {
      const updatedValues = Object.keys(context.values || {}).reduce((updatedKeys, term) => {
        const valuesForKey = formData.find(data => data.key === term);
        const updatedValue = valuesForKey?.values.find(value => value.locale === locale);
        return {
          ...updatedKeys,
          [term]: updatedValue?.value,
        };
      }, {});
      return { ...context, values: updatedValues };
    });
    return { ...translation, contexts: updatedContext };
  });
  return preparedTranslations;
};

export type { formDataType };
export { prepareTranslationsToSave, prepareFormValues };
