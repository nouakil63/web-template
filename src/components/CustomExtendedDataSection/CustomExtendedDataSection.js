import React from 'react';

import { SCHEMA_TYPE_MULTI_ENUM, SCHEMA_TYPE_TEXT, SCHEMA_TYPE_YOUTUBE } from '../../util/types';

import SectionDetails from './SectionDetails';
import SectionText from './SectionText';
import SectionMultiEnum from './SectionMultiEnum';
import SectionYoutubeVideo from './SectionYoutubeVideo';

const CustomExtendedDataSection = props => {
  const { sectionDetailsProps, propsForCustomFields = [], page, pickExtendedDataFields } = props;

  return (
    <>
      <SectionDetails
        {...sectionDetailsProps}
        page={page}
        pickExtendedDataFields={pickExtendedDataFields}
      />
      {propsForCustomFields.map(customFieldProps => {
        const { schemaType, key, ...fieldProps } = customFieldProps;
        return schemaType === SCHEMA_TYPE_MULTI_ENUM ? (
          <SectionMultiEnum key={key} page={page} {...fieldProps} />
        ) : schemaType === SCHEMA_TYPE_TEXT ? (
          <SectionText key={key} {...fieldProps} />
        ) : schemaType === SCHEMA_TYPE_YOUTUBE ? (
          <SectionYoutubeVideo key={key} {...fieldProps} />
        ) : null;
      })}
    </>
  );
};

export default CustomExtendedDataSection;
