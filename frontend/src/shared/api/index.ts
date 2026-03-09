import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AdditionalResultItemType = {
  __typename?: 'AdditionalResultItemType';
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type AuthenticateType = {
  __typename?: 'AuthenticateType';
  accessToken: Scalars['String']['output'];
  user: UserType;
};

export type CreateGameInput = {
  leaderName: Scalars['String']['input'];
};

export type GameChoiceType = {
  __typename?: 'GameChoiceType';
  chosen: Scalars['Boolean']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type GameChosenChoiceType = {
  __typename?: 'GameChosenChoiceType';
  participation: GameParticipationType;
  result?: Maybe<Scalars['String']['output']>;
  resultTags: Array<Scalars['String']['output']>;
  self: Scalars['Boolean']['output'];
  titleForEveryone: Scalars['String']['output'];
};

export type GameParticipationType = {
  __typename?: 'GameParticipationType';
  id: Scalars['Int']['output'];
  leader: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  self: Scalars['Boolean']['output'];
};

export type GameQuestionType = {
  __typename?: 'GameQuestionType';
  answered: Scalars['Boolean']['output'];
  choices: Array<GameChoiceType>;
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type GameResultType = {
  __typename?: 'GameResultType';
  additionalResults?: Maybe<Array<AdditionalResultItemType>>;
  description: Scalars['String']['output'];
  participant: GameParticipationType;
  score: Scalars['Int']['output'];
};

export type GameStateType = {
  __typename?: 'GameStateType';
  code: Scalars['String']['output'];
  currentTurnIndex: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isLeader: Scalars['Boolean']['output'];
  status: GameStatusEnum;
  totalTurns: Scalars['Int']['output'];
  turns: Array<GameTurnType>;
};

export enum GameStatusEnum {
  Ended = 'ended',
  GeneratingResults = 'generating_results',
  InLobby = 'in_lobby',
  InProgress = 'in_progress'
}

export type GameTurnType = {
  __typename?: 'GameTurnType';
  countConfirmed: Scalars['Int']['output'];
  hasConfirmed: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  status: TurnStatusEnum;
  year: Scalars['Int']['output'];
};

export type GameType = {
  __typename?: 'GameType';
  code: Scalars['String']['output'];
  gameSettingId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  status: GameStatusEnum;
};

export type JoinGameInput = {
  gameId: Scalars['Int']['input'];
  participationName: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Make a choice for the current question */
  chooseOption: GameChoiceType;
  /** Confirm the turn has been viewed by the participant. */
  confirmTurn: GameTurnType;
  /** create a new game (lobby), set name to the leader */
  createGame: GameType;
  /** Получить URL для OAuth авторизации */
  createOauthUrl: Scalars['String']['output'];
  /** Join a game (lobby) */
  joinGame: GameParticipationType;
  /** Вход через OAuth */
  oauthAuthenticate: AuthenticateType;
  /** Регистрация нового пользователя */
  register: AuthenticateType;
  /** start a new game (lobby) */
  startGame: GameType;
};


export type MutationChooseOptionArgs = {
  choiceId: Scalars['Int']['input'];
};


export type MutationConfirmTurnArgs = {
  gameId: Scalars['Int']['input'];
};


export type MutationCreateGameArgs = {
  data: CreateGameInput;
};


export type MutationCreateOauthUrlArgs = {
  data: OAuthUrlInput;
};


export type MutationJoinGameArgs = {
  data: JoinGameInput;
};


export type MutationOauthAuthenticateArgs = {
  data: OAuthInput;
};


export type MutationRegisterArgs = {
  data: RegisterInput;
};


export type MutationStartGameArgs = {
  gameId: Scalars['Int']['input'];
};

/** Input model for oauth login/register */
export type OAuthInput = {
  /** Authorization code from OAuth provider */
  code: Scalars['String']['input'];
  /** State parameter from OAuth provider */
  state: Scalars['String']['input'];
};

export enum OAuthProvider {
  Google = 'GOOGLE'
}

export type OAuthUrlInput = {
  provider: OAuthProvider;
  redirectUri: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  /** Get current questions for the participant. */
  currentGameQuestions: Array<GameQuestionType>;
  /** Get a sorted list of participants for a game in lobby. */
  gameParticipants: Array<GameParticipationType>;
  /** Result of a game for a participant after the game ends */
  gameResult: Array<GameResultType>;
  /** Get the current state of the game. Polled while game.status = in_progress, and getting on refresh */
  gameState: GameStateType;
  /** Get game state by game code. Allows access to lobby for non-participants. */
  gameStateByCode: GameStateType;
  /** Get chosen choices by all participants for the last completed turn. */
  gameTurnChoices: Array<GameChosenChoiceType>;
  /** Login with credentials */
  login: AuthenticateType;
};


export type QueryCurrentGameQuestionsArgs = {
  gameId: Scalars['Int']['input'];
};


export type QueryGameParticipantsArgs = {
  gameId: Scalars['Int']['input'];
};


export type QueryGameResultArgs = {
  gameId: Scalars['Int']['input'];
};


export type QueryGameStateArgs = {
  gameId: Scalars['Int']['input'];
};


export type QueryGameStateByCodeArgs = {
  gameCode: Scalars['String']['input'];
};


export type QueryGameTurnChoicesArgs = {
  gameId: Scalars['Int']['input'];
};


export type QueryLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export enum TurnStatusEnum {
  Answered = 'answered',
  Confirmed = 'confirmed',
  Generating = 'generating',
  NotStarted = 'not_started',
  WaitingForAnswers = 'waiting_for_answers'
}

export type UserType = {
  __typename?: 'UserType';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
};

export type AuthenticateTypeFragmentFragment = { __typename?: 'AuthenticateType', accessToken: string, user: { __typename?: 'UserType', id: number, email: string, createdAt: any } };

export type GameChoiceFragment = { __typename?: 'GameChoiceType', id: number, title: string, description: string, chosen: boolean };

export type GameChosenChoiceFragment = { __typename?: 'GameChosenChoiceType', titleForEveryone: string, result?: string | null, self: boolean, resultTags: Array<string>, participation: { __typename?: 'GameParticipationType', id: number, name: string, leader: boolean, self: boolean } };

export type GameTypeFragment = { __typename?: 'GameType', id: number, code: string, status: GameStatusEnum, gameSettingId: number };

export type GameStateFragment = { __typename?: 'GameStateType', id: number, code: string, status: GameStatusEnum, currentTurnIndex: number, totalTurns: number, isLeader: boolean, turns: Array<{ __typename?: 'GameTurnType', id: number, index: number, year: number, status: TurnStatusEnum, countConfirmed: number, hasConfirmed: boolean }> };

export type GameFragment = { __typename?: 'GameType', id: number, code: string, status: GameStatusEnum };

export type GameTurnFragment = { __typename?: 'GameTurnType', id: number, index: number, year: number, status: TurnStatusEnum, countConfirmed: number, hasConfirmed: boolean };

export type GameParticipantFragment = { __typename?: 'GameParticipationType', id: number, name: string, leader: boolean, self: boolean };

export type GameQuestionFragment = { __typename?: 'GameQuestionType', id: number, title: string, answered: boolean, choices: Array<{ __typename?: 'GameChoiceType', id: number, title: string, description: string, chosen: boolean }> };

export type GameResultFragment = { __typename?: 'GameResultType', score: number, description: string, participant: { __typename?: 'GameParticipationType', id: number, name: string, leader: boolean, self: boolean }, additionalResults?: Array<{ __typename?: 'AdditionalResultItemType', id: number, title: string, description: string }> | null };

export type RegisterMutationVariables = Exact<{
  data: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthenticateType', accessToken: string, user: { __typename?: 'UserType', id: number, email: string, createdAt: any } } };

export type CreateOauthUrlMutationVariables = Exact<{
  data: OAuthUrlInput;
}>;


export type CreateOauthUrlMutation = { __typename?: 'Mutation', createOauthUrl: string };

export type OauthAuthenticateMutationVariables = Exact<{
  data: OAuthInput;
}>;


export type OauthAuthenticateMutation = { __typename?: 'Mutation', oauthAuthenticate: { __typename?: 'AuthenticateType', accessToken: string, user: { __typename?: 'UserType', id: number, email: string, createdAt: any } } };

export type ChooseOptionMutationVariables = Exact<{
  choiceId: Scalars['Int']['input'];
}>;


export type ChooseOptionMutation = { __typename?: 'Mutation', chooseOption: { __typename?: 'GameChoiceType', id: number, title: string, description: string, chosen: boolean } };

export type CreateGameMutationVariables = Exact<{
  data: CreateGameInput;
}>;


export type CreateGameMutation = { __typename?: 'Mutation', createGame: { __typename?: 'GameType', id: number, code: string, status: GameStatusEnum, gameSettingId: number } };

export type StartGameMutationVariables = Exact<{
  gameId: Scalars['Int']['input'];
}>;


export type StartGameMutation = { __typename?: 'Mutation', startGame: { __typename?: 'GameType', id: number, code: string, status: GameStatusEnum } };

export type JoinGameMutationVariables = Exact<{
  data: JoinGameInput;
}>;


export type JoinGameMutation = { __typename?: 'Mutation', joinGame: { __typename?: 'GameParticipationType', id: number, name: string, leader: boolean, self: boolean } };

export type ConfirmTurnMutationVariables = Exact<{
  gameId: Scalars['Int']['input'];
}>;


export type ConfirmTurnMutation = { __typename?: 'Mutation', confirmTurn: { __typename?: 'GameTurnType', id: number, index: number, year: number, status: TurnStatusEnum, countConfirmed: number, hasConfirmed: boolean } };

export type LoginQueryVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'AuthenticateType', accessToken: string, user: { __typename?: 'UserType', id: number, email: string, createdAt: any } } };

export type GameTurnChoicesQueryVariables = Exact<{
  gameId: Scalars['Int']['input'];
}>;


export type GameTurnChoicesQuery = { __typename?: 'Query', gameTurnChoices: Array<{ __typename?: 'GameChosenChoiceType', titleForEveryone: string, result?: string | null, self: boolean, resultTags: Array<string>, participation: { __typename?: 'GameParticipationType', id: number, name: string, leader: boolean, self: boolean } }> };

export type GameStateQueryVariables = Exact<{
  gameId: Scalars['Int']['input'];
}>;


export type GameStateQuery = { __typename?: 'Query', gameState: { __typename?: 'GameStateType', id: number, code: string, status: GameStatusEnum, currentTurnIndex: number, totalTurns: number, isLeader: boolean, turns: Array<{ __typename?: 'GameTurnType', id: number, index: number, year: number, status: TurnStatusEnum, countConfirmed: number, hasConfirmed: boolean }> } };

export type GameStateByCodeQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type GameStateByCodeQuery = { __typename?: 'Query', gameStateByCode: { __typename?: 'GameStateType', id: number, code: string, status: GameStatusEnum, currentTurnIndex: number, totalTurns: number, isLeader: boolean, turns: Array<{ __typename?: 'GameTurnType', id: number, index: number, year: number, status: TurnStatusEnum, countConfirmed: number, hasConfirmed: boolean }> } };

export type GameParticipantsQueryVariables = Exact<{
  gameId: Scalars['Int']['input'];
}>;


export type GameParticipantsQuery = { __typename?: 'Query', gameParticipants: Array<{ __typename?: 'GameParticipationType', id: number, name: string, leader: boolean, self: boolean }> };

export type CurrentGameQuestionsQueryVariables = Exact<{
  gameId: Scalars['Int']['input'];
}>;


export type CurrentGameQuestionsQuery = { __typename?: 'Query', currentGameQuestions: Array<{ __typename?: 'GameQuestionType', id: number, title: string, answered: boolean, choices: Array<{ __typename?: 'GameChoiceType', id: number, title: string, description: string, chosen: boolean }> }> };

export type GameResultQueryVariables = Exact<{
  gameId: Scalars['Int']['input'];
}>;


export type GameResultQuery = { __typename?: 'Query', gameResult: Array<{ __typename?: 'GameResultType', score: number, description: string, participant: { __typename?: 'GameParticipationType', id: number, name: string, leader: boolean, self: boolean }, additionalResults?: Array<{ __typename?: 'AdditionalResultItemType', id: number, title: string, description: string }> | null }> };

export const AuthenticateTypeFragmentFragmentDoc = gql`
    fragment AuthenticateTypeFragment on AuthenticateType {
  user {
    id
    email
    createdAt
  }
  accessToken
}
    `;
export const GameChoiceFragmentDoc = gql`
    fragment GameChoice on GameChoiceType {
  id
  title
  description
  chosen
}
    `;
export const GameParticipantFragmentDoc = gql`
    fragment GameParticipant on GameParticipationType {
  id
  name
  leader
  self
}
    `;
export const GameChosenChoiceFragmentDoc = gql`
    fragment GameChosenChoice on GameChosenChoiceType {
  participation {
    ...GameParticipant
  }
  titleForEveryone
  result
  self
  resultTags
}
    ${GameParticipantFragmentDoc}`;
export const GameTypeFragmentDoc = gql`
    fragment GameType on GameType {
  id
  code
  status
  gameSettingId
}
    `;
export const GameTurnFragmentDoc = gql`
    fragment GameTurn on GameTurnType {
  id
  index
  year
  status
  countConfirmed
  hasConfirmed
}
    `;
export const GameStateFragmentDoc = gql`
    fragment GameState on GameStateType {
  id
  code
  status
  currentTurnIndex
  totalTurns
  isLeader
  turns {
    ...GameTurn
  }
}
    ${GameTurnFragmentDoc}`;
export const GameFragmentDoc = gql`
    fragment Game on GameType {
  id
  code
  status
}
    `;
export const GameQuestionFragmentDoc = gql`
    fragment GameQuestion on GameQuestionType {
  id
  title
  choices {
    id
    title
    description
    chosen
  }
  answered
}
    `;
export const GameResultFragmentDoc = gql`
    fragment GameResult on GameResultType {
  participant {
    id
    name
    leader
    self
  }
  score
  description
  additionalResults {
    id
    title
    description
  }
}
    `;
export const RegisterDocument = gql`
    mutation register($data: RegisterInput!) {
  register(data: $data) {
    ...AuthenticateTypeFragment
  }
}
    ${AuthenticateTypeFragmentFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const CreateOauthUrlDocument = gql`
    mutation createOauthUrl($data: OAuthUrlInput!) {
  createOauthUrl(data: $data)
}
    `;
export type CreateOauthUrlMutationFn = Apollo.MutationFunction<CreateOauthUrlMutation, CreateOauthUrlMutationVariables>;

/**
 * __useCreateOauthUrlMutation__
 *
 * To run a mutation, you first call `useCreateOauthUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOauthUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOauthUrlMutation, { data, loading, error }] = useCreateOauthUrlMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateOauthUrlMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateOauthUrlMutation, CreateOauthUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateOauthUrlMutation, CreateOauthUrlMutationVariables>(CreateOauthUrlDocument, options);
      }
export type CreateOauthUrlMutationHookResult = ReturnType<typeof useCreateOauthUrlMutation>;
export type CreateOauthUrlMutationResult = Apollo.MutationResult<CreateOauthUrlMutation>;
export type CreateOauthUrlMutationOptions = Apollo.BaseMutationOptions<CreateOauthUrlMutation, CreateOauthUrlMutationVariables>;
export const OauthAuthenticateDocument = gql`
    mutation oauthAuthenticate($data: OAuthInput!) {
  oauthAuthenticate(data: $data) {
    ...AuthenticateTypeFragment
  }
}
    ${AuthenticateTypeFragmentFragmentDoc}`;
export type OauthAuthenticateMutationFn = Apollo.MutationFunction<OauthAuthenticateMutation, OauthAuthenticateMutationVariables>;

/**
 * __useOauthAuthenticateMutation__
 *
 * To run a mutation, you first call `useOauthAuthenticateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOauthAuthenticateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [oauthAuthenticateMutation, { data, loading, error }] = useOauthAuthenticateMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useOauthAuthenticateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<OauthAuthenticateMutation, OauthAuthenticateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<OauthAuthenticateMutation, OauthAuthenticateMutationVariables>(OauthAuthenticateDocument, options);
      }
export type OauthAuthenticateMutationHookResult = ReturnType<typeof useOauthAuthenticateMutation>;
export type OauthAuthenticateMutationResult = Apollo.MutationResult<OauthAuthenticateMutation>;
export type OauthAuthenticateMutationOptions = Apollo.BaseMutationOptions<OauthAuthenticateMutation, OauthAuthenticateMutationVariables>;
export const ChooseOptionDocument = gql`
    mutation chooseOption($choiceId: Int!) {
  chooseOption(choiceId: $choiceId) {
    ...GameChoice
  }
}
    ${GameChoiceFragmentDoc}`;
export type ChooseOptionMutationFn = Apollo.MutationFunction<ChooseOptionMutation, ChooseOptionMutationVariables>;

/**
 * __useChooseOptionMutation__
 *
 * To run a mutation, you first call `useChooseOptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChooseOptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chooseOptionMutation, { data, loading, error }] = useChooseOptionMutation({
 *   variables: {
 *      choiceId: // value for 'choiceId'
 *   },
 * });
 */
export function useChooseOptionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ChooseOptionMutation, ChooseOptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ChooseOptionMutation, ChooseOptionMutationVariables>(ChooseOptionDocument, options);
      }
export type ChooseOptionMutationHookResult = ReturnType<typeof useChooseOptionMutation>;
export type ChooseOptionMutationResult = Apollo.MutationResult<ChooseOptionMutation>;
export type ChooseOptionMutationOptions = Apollo.BaseMutationOptions<ChooseOptionMutation, ChooseOptionMutationVariables>;
export const CreateGameDocument = gql`
    mutation createGame($data: CreateGameInput!) {
  createGame(data: $data) {
    ...GameType
  }
}
    ${GameTypeFragmentDoc}`;
export type CreateGameMutationFn = Apollo.MutationFunction<CreateGameMutation, CreateGameMutationVariables>;

/**
 * __useCreateGameMutation__
 *
 * To run a mutation, you first call `useCreateGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGameMutation, { data, loading, error }] = useCreateGameMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateGameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateGameMutation, CreateGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateGameMutation, CreateGameMutationVariables>(CreateGameDocument, options);
      }
export type CreateGameMutationHookResult = ReturnType<typeof useCreateGameMutation>;
export type CreateGameMutationResult = Apollo.MutationResult<CreateGameMutation>;
export type CreateGameMutationOptions = Apollo.BaseMutationOptions<CreateGameMutation, CreateGameMutationVariables>;
export const StartGameDocument = gql`
    mutation StartGame($gameId: Int!) {
  startGame(gameId: $gameId) {
    ...Game
  }
}
    ${GameFragmentDoc}`;
export type StartGameMutationFn = Apollo.MutationFunction<StartGameMutation, StartGameMutationVariables>;

/**
 * __useStartGameMutation__
 *
 * To run a mutation, you first call `useStartGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startGameMutation, { data, loading, error }] = useStartGameMutation({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useStartGameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<StartGameMutation, StartGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<StartGameMutation, StartGameMutationVariables>(StartGameDocument, options);
      }
export type StartGameMutationHookResult = ReturnType<typeof useStartGameMutation>;
export type StartGameMutationResult = Apollo.MutationResult<StartGameMutation>;
export type StartGameMutationOptions = Apollo.BaseMutationOptions<StartGameMutation, StartGameMutationVariables>;
export const JoinGameDocument = gql`
    mutation JoinGame($data: JoinGameInput!) {
  joinGame(data: $data) {
    ...GameParticipant
  }
}
    ${GameParticipantFragmentDoc}`;
export type JoinGameMutationFn = Apollo.MutationFunction<JoinGameMutation, JoinGameMutationVariables>;

/**
 * __useJoinGameMutation__
 *
 * To run a mutation, you first call `useJoinGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinGameMutation, { data, loading, error }] = useJoinGameMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useJoinGameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<JoinGameMutation, JoinGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<JoinGameMutation, JoinGameMutationVariables>(JoinGameDocument, options);
      }
export type JoinGameMutationHookResult = ReturnType<typeof useJoinGameMutation>;
export type JoinGameMutationResult = Apollo.MutationResult<JoinGameMutation>;
export type JoinGameMutationOptions = Apollo.BaseMutationOptions<JoinGameMutation, JoinGameMutationVariables>;
export const ConfirmTurnDocument = gql`
    mutation ConfirmTurn($gameId: Int!) {
  confirmTurn(gameId: $gameId) {
    ...GameTurn
  }
}
    ${GameTurnFragmentDoc}`;
export type ConfirmTurnMutationFn = Apollo.MutationFunction<ConfirmTurnMutation, ConfirmTurnMutationVariables>;

/**
 * __useConfirmTurnMutation__
 *
 * To run a mutation, you first call `useConfirmTurnMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmTurnMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmTurnMutation, { data, loading, error }] = useConfirmTurnMutation({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useConfirmTurnMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ConfirmTurnMutation, ConfirmTurnMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ConfirmTurnMutation, ConfirmTurnMutationVariables>(ConfirmTurnDocument, options);
      }
export type ConfirmTurnMutationHookResult = ReturnType<typeof useConfirmTurnMutation>;
export type ConfirmTurnMutationResult = Apollo.MutationResult<ConfirmTurnMutation>;
export type ConfirmTurnMutationOptions = Apollo.BaseMutationOptions<ConfirmTurnMutation, ConfirmTurnMutationVariables>;
export const LoginDocument = gql`
    query login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    ...AuthenticateTypeFragment
  }
}
    ${AuthenticateTypeFragmentFragmentDoc}`;

/**
 * __useLoginQuery__
 *
 * To run a query within a React component, call `useLoginQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginQuery({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginQuery(baseOptions: ApolloReactHooks.QueryHookOptions<LoginQuery, LoginQueryVariables> & ({ variables: LoginQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
      }
export function useLoginLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<LoginQuery, LoginQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
        }
export function useLoginSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<LoginQuery, LoginQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
        }
export type LoginQueryHookResult = ReturnType<typeof useLoginQuery>;
export type LoginLazyQueryHookResult = ReturnType<typeof useLoginLazyQuery>;
export type LoginSuspenseQueryHookResult = ReturnType<typeof useLoginSuspenseQuery>;
export type LoginQueryResult = Apollo.QueryResult<LoginQuery, LoginQueryVariables>;
export const GameTurnChoicesDocument = gql`
    query GameTurnChoices($gameId: Int!) {
  gameTurnChoices(gameId: $gameId) {
    ...GameChosenChoice
  }
}
    ${GameChosenChoiceFragmentDoc}`;

/**
 * __useGameTurnChoicesQuery__
 *
 * To run a query within a React component, call `useGameTurnChoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGameTurnChoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameTurnChoicesQuery({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useGameTurnChoicesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GameTurnChoicesQuery, GameTurnChoicesQueryVariables> & ({ variables: GameTurnChoicesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GameTurnChoicesQuery, GameTurnChoicesQueryVariables>(GameTurnChoicesDocument, options);
      }
export function useGameTurnChoicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GameTurnChoicesQuery, GameTurnChoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GameTurnChoicesQuery, GameTurnChoicesQueryVariables>(GameTurnChoicesDocument, options);
        }
export function useGameTurnChoicesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GameTurnChoicesQuery, GameTurnChoicesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GameTurnChoicesQuery, GameTurnChoicesQueryVariables>(GameTurnChoicesDocument, options);
        }
export type GameTurnChoicesQueryHookResult = ReturnType<typeof useGameTurnChoicesQuery>;
export type GameTurnChoicesLazyQueryHookResult = ReturnType<typeof useGameTurnChoicesLazyQuery>;
export type GameTurnChoicesSuspenseQueryHookResult = ReturnType<typeof useGameTurnChoicesSuspenseQuery>;
export type GameTurnChoicesQueryResult = Apollo.QueryResult<GameTurnChoicesQuery, GameTurnChoicesQueryVariables>;
export const GameStateDocument = gql`
    query GameState($gameId: Int!) {
  gameState(gameId: $gameId) {
    ...GameState
  }
}
    ${GameStateFragmentDoc}`;

/**
 * __useGameStateQuery__
 *
 * To run a query within a React component, call `useGameStateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGameStateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameStateQuery({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useGameStateQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GameStateQuery, GameStateQueryVariables> & ({ variables: GameStateQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GameStateQuery, GameStateQueryVariables>(GameStateDocument, options);
      }
export function useGameStateLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GameStateQuery, GameStateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GameStateQuery, GameStateQueryVariables>(GameStateDocument, options);
        }
export function useGameStateSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GameStateQuery, GameStateQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GameStateQuery, GameStateQueryVariables>(GameStateDocument, options);
        }
export type GameStateQueryHookResult = ReturnType<typeof useGameStateQuery>;
export type GameStateLazyQueryHookResult = ReturnType<typeof useGameStateLazyQuery>;
export type GameStateSuspenseQueryHookResult = ReturnType<typeof useGameStateSuspenseQuery>;
export type GameStateQueryResult = Apollo.QueryResult<GameStateQuery, GameStateQueryVariables>;
export const GameStateByCodeDocument = gql`
    query GameStateByCode($code: String!) {
  gameStateByCode(gameCode: $code) {
    ...GameState
  }
}
    ${GameStateFragmentDoc}`;

/**
 * __useGameStateByCodeQuery__
 *
 * To run a query within a React component, call `useGameStateByCodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGameStateByCodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameStateByCodeQuery({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useGameStateByCodeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GameStateByCodeQuery, GameStateByCodeQueryVariables> & ({ variables: GameStateByCodeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GameStateByCodeQuery, GameStateByCodeQueryVariables>(GameStateByCodeDocument, options);
      }
export function useGameStateByCodeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GameStateByCodeQuery, GameStateByCodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GameStateByCodeQuery, GameStateByCodeQueryVariables>(GameStateByCodeDocument, options);
        }
export function useGameStateByCodeSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GameStateByCodeQuery, GameStateByCodeQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GameStateByCodeQuery, GameStateByCodeQueryVariables>(GameStateByCodeDocument, options);
        }
export type GameStateByCodeQueryHookResult = ReturnType<typeof useGameStateByCodeQuery>;
export type GameStateByCodeLazyQueryHookResult = ReturnType<typeof useGameStateByCodeLazyQuery>;
export type GameStateByCodeSuspenseQueryHookResult = ReturnType<typeof useGameStateByCodeSuspenseQuery>;
export type GameStateByCodeQueryResult = Apollo.QueryResult<GameStateByCodeQuery, GameStateByCodeQueryVariables>;
export const GameParticipantsDocument = gql`
    query GameParticipants($gameId: Int!) {
  gameParticipants(gameId: $gameId) {
    ...GameParticipant
  }
}
    ${GameParticipantFragmentDoc}`;

/**
 * __useGameParticipantsQuery__
 *
 * To run a query within a React component, call `useGameParticipantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGameParticipantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameParticipantsQuery({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useGameParticipantsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GameParticipantsQuery, GameParticipantsQueryVariables> & ({ variables: GameParticipantsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GameParticipantsQuery, GameParticipantsQueryVariables>(GameParticipantsDocument, options);
      }
export function useGameParticipantsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GameParticipantsQuery, GameParticipantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GameParticipantsQuery, GameParticipantsQueryVariables>(GameParticipantsDocument, options);
        }
export function useGameParticipantsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GameParticipantsQuery, GameParticipantsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GameParticipantsQuery, GameParticipantsQueryVariables>(GameParticipantsDocument, options);
        }
export type GameParticipantsQueryHookResult = ReturnType<typeof useGameParticipantsQuery>;
export type GameParticipantsLazyQueryHookResult = ReturnType<typeof useGameParticipantsLazyQuery>;
export type GameParticipantsSuspenseQueryHookResult = ReturnType<typeof useGameParticipantsSuspenseQuery>;
export type GameParticipantsQueryResult = Apollo.QueryResult<GameParticipantsQuery, GameParticipantsQueryVariables>;
export const CurrentGameQuestionsDocument = gql`
    query CurrentGameQuestions($gameId: Int!) {
  currentGameQuestions(gameId: $gameId) {
    ...GameQuestion
  }
}
    ${GameQuestionFragmentDoc}`;

/**
 * __useCurrentGameQuestionsQuery__
 *
 * To run a query within a React component, call `useCurrentGameQuestionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentGameQuestionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentGameQuestionsQuery({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useCurrentGameQuestionsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<CurrentGameQuestionsQuery, CurrentGameQuestionsQueryVariables> & ({ variables: CurrentGameQuestionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<CurrentGameQuestionsQuery, CurrentGameQuestionsQueryVariables>(CurrentGameQuestionsDocument, options);
      }
export function useCurrentGameQuestionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CurrentGameQuestionsQuery, CurrentGameQuestionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<CurrentGameQuestionsQuery, CurrentGameQuestionsQueryVariables>(CurrentGameQuestionsDocument, options);
        }
export function useCurrentGameQuestionsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<CurrentGameQuestionsQuery, CurrentGameQuestionsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<CurrentGameQuestionsQuery, CurrentGameQuestionsQueryVariables>(CurrentGameQuestionsDocument, options);
        }
export type CurrentGameQuestionsQueryHookResult = ReturnType<typeof useCurrentGameQuestionsQuery>;
export type CurrentGameQuestionsLazyQueryHookResult = ReturnType<typeof useCurrentGameQuestionsLazyQuery>;
export type CurrentGameQuestionsSuspenseQueryHookResult = ReturnType<typeof useCurrentGameQuestionsSuspenseQuery>;
export type CurrentGameQuestionsQueryResult = Apollo.QueryResult<CurrentGameQuestionsQuery, CurrentGameQuestionsQueryVariables>;
export const GameResultDocument = gql`
    query GameResult($gameId: Int!) {
  gameResult(gameId: $gameId) {
    ...GameResult
  }
}
    ${GameResultFragmentDoc}`;

/**
 * __useGameResultQuery__
 *
 * To run a query within a React component, call `useGameResultQuery` and pass it any options that fit your needs.
 * When your component renders, `useGameResultQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameResultQuery({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useGameResultQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GameResultQuery, GameResultQueryVariables> & ({ variables: GameResultQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GameResultQuery, GameResultQueryVariables>(GameResultDocument, options);
      }
export function useGameResultLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GameResultQuery, GameResultQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GameResultQuery, GameResultQueryVariables>(GameResultDocument, options);
        }
export function useGameResultSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GameResultQuery, GameResultQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GameResultQuery, GameResultQueryVariables>(GameResultDocument, options);
        }
export type GameResultQueryHookResult = ReturnType<typeof useGameResultQuery>;
export type GameResultLazyQueryHookResult = ReturnType<typeof useGameResultLazyQuery>;
export type GameResultSuspenseQueryHookResult = ReturnType<typeof useGameResultSuspenseQuery>;
export type GameResultQueryResult = Apollo.QueryResult<GameResultQuery, GameResultQueryVariables>;