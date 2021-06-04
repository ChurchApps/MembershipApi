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
  DateTime: any;
};

export type CorePagination = {
  from?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['Int']>;
  sort?: Maybe<SortDirection>;
};


export type DateTimeNullableFilter = {
  equals?: Maybe<Scalars['DateTime']>;
  gt?: Maybe<Scalars['DateTime']>;
  gte?: Maybe<Scalars['DateTime']>;
  in?: Maybe<Scalars['DateTime']>;
  lt?: Maybe<Scalars['DateTime']>;
  lte?: Maybe<Scalars['DateTime']>;
  not?: Maybe<Scalars['DateTime']>;
  notIn?: Maybe<Scalars['DateTime']>;
};

export type Group = {
  __typename?: 'Group';
  categoryName?: Maybe<Scalars['String']>;
  churchId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  parentPickup?: Maybe<Scalars['Boolean']>;
  removed?: Maybe<Scalars['Boolean']>;
  trackAttendance?: Maybe<Scalars['Boolean']>;
};

export type GroupWhereInput = {
  id: Scalars['ID'];
};

export type GroupsResult = {
  __typename?: 'GroupsResult';
  edges: Array<Group>;
  total: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  test?: Maybe<Scalars['Boolean']>;
};

export type PeopleWhereInput = {
  birthDate?: Maybe<DateTimeNullableFilter>;
  lastName?: Maybe<StringNullableFilter>;
};

export type Person = {
  __typename?: 'Person';
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  anniversary?: Maybe<Scalars['DateTime']>;
  birthDate?: Maybe<Scalars['DateTime']>;
  churchId?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Group>>;
  homePhone?: Maybe<Scalars['String']>;
  householdId?: Maybe<Scalars['String']>;
  householdRole?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  maritalStatus?: Maybe<Scalars['String']>;
  membershipStatus?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  mobilePhone?: Maybe<Scalars['String']>;
  nickName?: Maybe<Scalars['String']>;
  photoUpdated?: Maybe<Scalars['DateTime']>;
  prefix?: Maybe<Scalars['String']>;
  removed?: Maybe<Scalars['Boolean']>;
  state?: Maybe<Scalars['String']>;
  suffix?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  workPhone?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
};

export type PersonWhereInput = {
  id: Scalars['ID'];
};

export type PersonsResult = {
  __typename?: 'PersonsResult';
  edges: Array<Person>;
  total: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  group?: Maybe<Group>;
  groups?: Maybe<Array<Group>>;
  people: Array<Maybe<Person>>;
  person?: Maybe<Person>;
  q?: Maybe<Scalars['String']>;
};


export type QueryGroupArgs = {
  where?: Maybe<GroupWhereInput>;
};


export type QueryGroupsArgs = {
  pagination?: Maybe<CorePagination>;
};


export type QueryPeopleArgs = {
  pagination?: Maybe<CorePagination>;
  where?: Maybe<PeopleWhereInput>;
};


export type QueryPersonArgs = {
  where: PersonWhereInput;
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringNullableFilter = {
  contains?: Maybe<Scalars['String']>;
  endsWith?: Maybe<Scalars['String']>;
  equals?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  in?: Maybe<Scalars['String']>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  not?: Maybe<Scalars['String']>;
  notIn?: Maybe<Scalars['String']>;
  startsWith?: Maybe<Scalars['String']>;
};
