// @flow
import React, { useEffect, useContext } from 'react';
import { navigate, useStaticQuery, graphql } from 'gatsby';
import { Location } from '@reach/router';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Page from '../components/Page';
import Pagination from '../components/Pagination';
import { useSiteMetadata } from '../hooks';
import type { PageContext, AllMarkdownRemark } from '../types';
import {
  detectBrowserLanguage,
  LanguageContext
} from '../utils/languageContext';

type Props = {
  data: AllMarkdownRemark,
  pageContext: PageContext
};

const IndexTemplate = ({ data, pageContext }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = useSiteMetadata();

  const {
    currentPage,
    hasNextPage,
    hasPrevPage,
    prevPagePath,
    nextPagePath,
    language
  } = pageContext;

  useEffect(() => {
    const language = detectBrowserLanguage();
    if (language === 'ja') {
      navigate('/ja');
    }
  }, []);

  const { edges } = data.allMarkdownRemark;
  const pageTitle =
    currentPage > 0
      ? `Page${currentPage} - ${siteTitle[language]}`
      : siteTitle[language];

  return (
    <Layout title={pageTitle} description={siteSubtitle[language]}>
      <Sidebar isIndex />
      <Page>
        <Feed edges={edges} />
        <Pagination
          prevPagePath={prevPagePath}
          nextPagePath={nextPagePath}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
        />
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query IndexTemplate(
    $postsLimit: Int!
    $postsOffset: Int!
    $language: String!
  ) {
    allMarkdownRemark(
      limit: $postsLimit
      skip: $postsOffset
      filter: {
        frontmatter: {
          template: { eq: "post" }
          draft: { ne: true }
          language: { eq: $language }
        }
      }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          frontmatter {
            title
            date
            category
            description
          }
        }
      }
    }
  }
`;

export default IndexTemplate;
