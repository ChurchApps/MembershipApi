export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};


export type Mutation = {
  __typename?: 'Mutation';
  test?: Maybe<Scalars['Boolean']>;
};

export type Person = {
  __typename?: 'Person';
  churchId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  persons?: Maybe<Person[]>;
};


export type QueryPersonsArgs = {
  from?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['Int']>;
  sort?: Maybe<SortDirection>;
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}
