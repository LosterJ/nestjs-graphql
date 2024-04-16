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

customer.resolver.ts

    We created the CustomerResolver, defines one query resolver function and one field resolver function.
    - @Query() decoreator to annotated the query handler
    - @ResolverField() to annotated that method resolves the invoice field of another model
    - @Args() to exreact arguments form a request for use in the query handler

    In the top, @Resolver() accepts an optional arguement "of" that is used to specify the parent of a field resolver function and this model is passed to the field resolver method.

    Resolver class is not hold the logic, but abstract that login in to a service class, which our resolver class calls.

customer.service.ts

    TypeORM provices Repositories, which are connected to our data entities and used to execute queries on them.


        - Mutations
            - used for modifying server-side data in GraphQL
            - techinically, a Query could be implemented to add server-side data, but the common convention is to annotate any method that causes data to be written with the @Mutation() decorator
            - @Mutation() tells Nest that such a method is for data modification

customer.resolver.ts

    createCustomer() has been decorated with @Mutations() to indicate that it modifies or adds new data.

    If a mutation needs to take an object as an argument, we would need to create a special kind of object called InputType and then pass it as an argument to the method.

invoice.dto.ts

Test your GraphQL API using the GraphQL Playground

    npm run start:dev
    localhost:3000/graphql

Benefits of using GraphQL APIs

- Requests are faster: allows us to cut down our request and response size by choosing the specific fields you want to query
- Provides flexibility:
  - REST resources usually provide less data than needed (requiring a user to make multiple reqs to achive some functionality)
  - REST return unnecessary data where a super resource is built to accommodate multiple use case
  - GraphQL solves this by fetching and returning the data fields specified per request
- Structures data hierarchically: gql structures the relationship between data objects hierarchically, in a graph-like structure
- Is strongly typed: relies on schema, which are strongly typed definitions of the data where each field and level has defined types
- API versioning is not a problem

```
query {
  customer(id: "ae1827b9-be1c-479a-bcec-a1fee5abfcdc") {
    id
    name
    email
    phone
    address
    invoices{
      id
      invoiceNo
      description
      paymentStatus
    }
    created_at
    updated_at
  }
}
mutation{
  createCustomer(
    email: "kai@gmail.com"
    name: "Kai"
    phone: "097545464"
    address: "New York"
  ){
    id
    name
    address
    email
    phone
  }
}
mutation{
  createInvoice(
    invoice:{
      invoiceNo: "INV-001",
    paymentStatus: "PAID",
    description: "Services rendered in April 2024",
    customer: "ae1827b9-be1c-479a-bcec-a1fee5abfcdc",
    currency: "USD",
    taxRate: 15,
    issueDate: "2024-04-15T12:00:00Z",
    dueDate: "2024-05-15T12:00:00Z",
    note: "Please make payment by due date",
    items: [
      {
       description: "Consulting Services",
        rate: 100.00,
        quantity: 10
      },
      {
        description: "Software Development",
        rate: 150.00,
        quantity: 20
      }
    ]
    }
  ){
    id
    invoiceNo
  description
  customer{
    id
    name
  }
  paymentStatus
  currency
  taxRate
  issueDate
  dueDate
  note
  items{
    description
  }
  taxAmount
  subTotal
  total
  amountPaid
  outstandingBalance
  createdAt
  updatedAt
  }
}
```
