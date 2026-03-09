import { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';

dotenv.config();

const config: CodegenConfig = {
    schema: `https://${process.env.NEXT_PUBLIC_URL}/graphql`,
    documents: ['./src/**/*.graphql'],
    generates: {
        './schema.graphql': { plugins: ['schema-ast'] },
        'src/shared/api/index.ts': {
            plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
            config: {
                skipTypename: false,
                withHooks: true,
                withHOC: false,
                withComponent: false,
                avoidOptionals: false,
                apolloReactHooksImportFrom: '@apollo/client',
                withLazyQuery: true,
            },
        },
        './graphql.schema.json': { plugins: ['introspection'] },
    },
};
export default config;
