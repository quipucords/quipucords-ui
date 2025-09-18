/**
 * OverviewView Component
 *
 * This component provides a view for managing scans, including adding, running and deleting scans,
 * and also managing reports.
 *
 * @module overview
 */
import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import MultiContentCard from '@patternfly/react-component-groups/dist/dynamic/MultiContentCard';
import PageHeader from '@patternfly/react-component-groups/dist/dynamic/PageHeader';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionToggle,
  Card,
  CardBody,
  CardHeader,
  Content,
  ContentVariants,
  Flex,
  Icon,
  Split,
  SplitItem,
  PageSection
} from '@patternfly/react-core';
import { DataProcessorIcon, KeyIcon, OptimizeIcon } from '@patternfly/react-icons';
import './viewOverview.css';

const OverviewView: React.FunctionComponent = () => {
  const [expandedFaqItem, setExpandedFaqItem] = React.useState('faqAccordionItem0');
  const { t } = useTranslation();

  const onToggle = (id: string) => {
    if (id === expandedFaqItem) {
      setExpandedFaqItem('');
    } else {
      setExpandedFaqItem(id);
    }
  };

  const gettingStartedCards = [
    <Card isFullHeight isPlain key="card-1">
      <CardHeader>
        <Content component={ContentVariants.h4}>{t('view.overview.getting-started.header')}</Content>
      </CardHeader>
      <CardBody>
        <Content className="pf-v6-u-font-weight-bold pf-v6-u-mb-sm">
          <Icon size="md" className="pf-v6-u-pl-sm pf-v6-u-pr-md">
            <OptimizeIcon />
          </Icon>
          {t('view.overview.getting-started.item1.label')}
        </Content>
        <Content>
          <Trans i18nKey="view.overview.getting-started.item1.content" components={[<p key="p1" />]} />
        </Content>
      </CardBody>
    </Card>,
    <Card isFullHeight isPlain key="card-2">
      <CardHeader style={{ visibility: 'hidden' }}>-</CardHeader>
      <CardBody>
        <Content className="pf-v6-u-font-weight-bold pf-v6-u-mb-sm">
          <Icon size="md" className="pf-v6-u-pl-sm pf-v6-u-pr-md">
            <KeyIcon />
          </Icon>
          {t('view.overview.getting-started.item2.label')}
        </Content>
        <Content>
          <Trans i18nKey="view.overview.getting-started.item2.content" components={[<p key="p1" />]} />
        </Content>
      </CardBody>
    </Card>,
    <Card isFullHeight isPlain key="card-3">
      <CardHeader style={{ visibility: 'hidden' }}>-</CardHeader>
      <CardBody>
        <Content className="pf-v6-u-font-weight-bold pf-v6-u-mb-sm">
          <Icon size="md" className="pf-v6-u-pl-sm pf-v6-u-pr-md">
            <DataProcessorIcon />
          </Icon>
          {t('view.overview.getting-started.item3.label')}
        </Content>
        <Content>
          <Trans i18nKey="view.overview.getting-started.item3.content" components={[<p key="p1" />]} />
        </Content>
      </CardBody>
    </Card>
  ];

  const processItems = [
    {
      label: t('view.overview.process.item1.label'),
      content: t('view.overview.process.item1.content')
    },
    {
      label: t('view.overview.process.item2.label'),
      content: t('view.overview.process.item2.content')
    },
    {
      label: t('view.overview.process.item3.label'),
      content: t('view.overview.process.item3.content')
    },
    {
      label: t('view.overview.process.item4.label'),
      content: t('view.overview.process.item4.content')
    },
    {
      label: t('view.overview.process.item5.label'),
      content: t('view.overview.process.item5.content')
    }
  ];

  const accordionItems = [
    {
      toggleLabel: t('view.overview.faq.item1.label'),
      contentChildren: <Trans i18nKey="view.overview.faq.item1.content" components={[<p key="p1" />]} />
    },
    {
      toggleLabel: t('view.overview.faq.item2.label'),
      contentChildren: <Trans i18nKey="view.overview.faq.item2.content" components={[<p key="p1" />]} />
    },
    {
      toggleLabel: t('view.overview.faq.item3.label'),
      contentChildren: <Trans i18nKey="view.overview.faq.item3.content" components={[<p key="p1" />]} />
    },
    {
      toggleLabel: t('view.overview.faq.item4.label'),
      contentChildren: <Trans i18nKey="view.overview.faq.item4.content" components={[<p key="p1" />]} />
    }
  ];

  return (
    <PageSection hasBodyWrapper={false}>
      <PageHeader title={t('view.overview.title')} />
      <MultiContentCard cards={gettingStartedCards} />
      <Card isFullHeight>
        <CardHeader className="pf-v6-u-font-weight-bold">{t('view.overview.process.header')}</CardHeader>
        <CardBody id="process">
          <Flex
            spaceItems={{ default: 'spaceItemsXl', lg: 'spaceItemsNone' }}
            justifyContent={{ default: 'justifyContentSpaceBetween' }}
          >
            {processItems.map((itemDefinition, idx) => {
              return (
                <Card key={`process-${idx}`}>
                  <CardHeader className="pf-v6-u-font-weight-bold">{itemDefinition.label}</CardHeader>
                  <CardBody>{itemDefinition.content}</CardBody>
                </Card>
              );
            })}
          </Flex>
        </CardBody>
      </Card>
      <Split hasGutter>
        <SplitItem>
          <Card isFullHeight>
            <CardHeader>Upload the scan report</CardHeader>
            <CardBody>
              <Content>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </Content>
            </CardBody>
          </Card>
        </SplitItem>
        <SplitItem isFilled>
          <Card isFullHeight id="faq">
            <CardHeader className="pf-v6-u-font-weight-bold">{t('view.overview.faq.header')}</CardHeader>
            <CardBody>
              <Accordion asDefinitionList>
                {accordionItems.map((accordionDef, idx) => {
                  const itemId = `faqAccordionItem${idx}`;
                  return (
                    <AccordionItem isExpanded={expandedFaqItem === itemId} key={itemId}>
                      <AccordionToggle
                        onClick={() => {
                          onToggle(itemId);
                        }}
                        id={itemId}
                      >
                        {accordionDef.toggleLabel}
                      </AccordionToggle>
                      <AccordionContent id={`faqAccordionItemExpand${idx}`}>
                        {accordionDef.contentChildren}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardBody>
          </Card>
        </SplitItem>
      </Split>
    </PageSection>
  );
};

export default OverviewView;
