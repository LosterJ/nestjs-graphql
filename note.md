app.module.ts

    imports: [
        GraphQLModule.forRoot({
            autoSchemaFile: ...
        }),
        TypeOrmModule.forRoot({
            type: ....
            ....
        })
    ]

    GraphQLModule is a wrapper over Apollo Server.
    forRoot() for config the underlying Apollo instance.
        list of options that is passed into the ApolloServer() constructor

    This code use the code-first approach, which use decorators and TS classes to gen the GraphQL Schema.
        SO we need to add the autoSchemaFile property
            path to where our gen schema to creted

    Nest is db-agnostic, meaning it allows interation with any db (ORM or ODM)
    In this tutorial, we use PostgreSQL and TypeORM

About GraphQL API
Nest offers 2 methods to build GraphQL API: code-first & schema-first - code-first: - using TS classes and decorators to gen GraphQL schema - can reuse data model class as schema and decorate with @ObjectType() - nest autogen schema from model - schema-first: - defining the schema using GraphQL's Schema Definition Language (SDL) - implementing a service by matching the definitions in schema

    With code-first approach, @nestjs/graphql gen the schema from reading metadata specific in decorators

    GraphQL components
        - Resolvers:
            - provide instructions for turning GraphQL operation into data, return the type of data we specify in our schema, or a promise for that data
            - @nestjs/graphql auto gen a resolver map using metadata provided by the decorators
            - In this code, we'll create a simple invoice API
        - Object types:
            - a collection of fields that you can fetch from your service, each field declaring a type
            - each defined object type represents a domain object in your API, specifying the structure of the data that can be queried or mutated in API.
            - In this code, our sample invoice API needs to be able to fetch a list of customers and their invoices, so we define the Customer and Invoice object types to support this functionality
            - used to define query objects, mutations, and schema for API
            - in code-first, we'll define schema using TS class and decorator to annotate the field

customer.model.ts

    @ObjectType() from @nestjs/graphql tells NestJS that the class is an object class and will then be used to gen CustomerModel schema
    ObjectType() decorator also optionally takes the name of the type being created, useful to add this name when error contain uniquely named types


        - Schemas:
            - definiton of the structure of the data queried in the API, it defines the fields of data, the types, also operations that can be performed
            - written in GraphQL SDL
            - using code-first, the schema is gen-ed using TS class and ObjectType decorator and store in where you config in autoSchemaFile in app.module.ts
        - Fields:
            - Each property in CustomerModel class above is decorated with the @Field() decorator to provide metadata about each field's GraphQL type, optionality, and attributes like being nullable
            - @Field() decorator accepts an optional type function (type->Int) or be an option object
            - When field is an array, we must manually indicate the array type in the @Field() decorator's type function.
        - GraphQL special object types
            - GraphQL have 2 special types: Query and Mutation
            - They serve as parents to other object types and define the entry point to other objects.
            - Every GraphQL API has a Query type and may/maynot have a Mutation type
            - Query objects are used to make read (SELECT) requests
            - Mutation objects are used to make create, update, delete request
            - In code-first, a resolver class both defines resolver functions and generates the Query type.
                - To create a resolver, we'll create a class with resolver functions as methods and decorate the class with the @Resolver() decorator

