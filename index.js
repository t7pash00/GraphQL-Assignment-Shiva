let express = require('express');
let bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

const schema = gql`
  type Mutation {    
    createStudent(
      name: String,
      birthday: String,
      email: String,
      classId: String,
      address: String,       
      ): createdResponse!
   
    updateStudent (
      id: ID!,
      name: String,
      birthday: String,
      email: String,
      classId: String,
      address: String,       
        ): updatedResponse!

    createCourse (
      name: String,
      description: String,
      teacher: String,
        ):createdResponse! 

    updateCourse (
      id: ID!
      name: String,
      description: String,
      teacher: String,
        ):updatedResponse! 
    
    createGrade (
      studentid: ID,
      courseid: ID,
      grade: String,
        ): createdResponse!

    updateGrade(
      id: ID!,
      studentid: ID,
      courseid: ID,
      grade: String,
      ): updatedResponse!

    }
 
type Query {
    student(id: ID!): Student,
    students: [Student!]!,
    course(id: ID!): Course,
    courses: [Course!]!,
    grade(id: ID!): Grade,
    grades: [Grade!]!,
    gradeByStudent(studentid: ID!): [Grade!]!, 
    gradeByCourse(courseid: ID!): [Grade!]!
}

type Student {
    id: ID!,
    name: String,
    birthday: String,
    email: String,
    classId: String,
    address: String,
  }

type Course {
    id: ID!,
    name: String
    description: String,
    teacher: String,
  }

type Grade {
  id: ID!,
  studentid: ID,
  courseid: ID,
  grade: String,
}

type createdResponse {
  success: Boolean!
}

type updatedResponse {
  success: Boolean!
}
`;

let s = 1;

const students = [
  {
    id: s++,
    name: "Shambo Pandey",
    birthday: "1995-01-06",
    email: "shambho.pandey@gmail.com",
    classId: "DIN17SP",
    address: "Kotkantie 1 Oulu"

  },
  {
    id: s++,
    name: "Nita Björkman",
    birthday: "1996-09-07",
    email: "nita.bjorkman@gmail.com",
    classId: "DIN18SP",
    address: "Hanhitie 17 Oulu",

  },
  {
    id: s++,
    name: "Janne Kodistalo",
    birthday: "2001-02-13",
    email: "janne.kodistalo@gmail.com",
    classId: "DIN18SP",
    address: "Raksila 17 Oulu"


  }
];

let c = 1;
let courses = [
    {
        id: c++,
        name: "Practical DevOps Security",
        description: "The road to continuous security in development lifecycle. Good for beginners.",
        teacher: "Teemu Korpela"
    },
    {
        id: c++,
        name: "Introduction to HTML",
        description: "A complete beginner to Expert.",
        teacher: "Lasse Havarinen"
        

    },
    {
        id: c++,
        name: "Python Deep Learning",
        description: "It is the second edition and good as well for the beginners.",
        teacher: "Kari Laitinen"
        
    }
];

let g= 1;
let grades = [
    {
        id: g++,
        studentid: 1,
        courseid: 2,
        grade: 5
    },
    {
        id: g++,
        studentid: 3,
        courseid: 3,
        grade: 4
    },
    {
        id: g++,
        studentid: 2,
        courseid: 2,
        grade: 3
    }
];


const resolvers = {
  Query: {
    student: (parent, args, context, info) => {
      console.log("Query resolver, args", args);
      return students.find(s => s.id === +args.id);
    },
    students: (parents, args, context, info) => {
      return students;
    },
    course: (parent, args, context, info) => {
      return courses.find(c => c.id === +args.id)
    },
    courses: (parents, args, context, info) => {
      return courses;
        },
        grade: (parents, args, context, info) => {
            return grades.find(g => g.id === +args.id);
        },
        grades: (parent, args, context, info) => {
            return grades;
        },
        gradeByStudent: (parent, args, context, info) => {
          if (args.studentid) {
              return grades.filter(g => g.studentid === +args.studentid);
          }
          
        },
        gradeByCourse: (parent, args, context, info) => {
          if (args.courseid) {
              return grades.filter(g => g.courseid === +args.courseid);
          }

          }
        },

  Mutation: {
    createStudent: (parent, args, context, info) => {
      const student = {
        id: ((students.length) + 1).toString(),
        name: args.name,
        birthday: args.birthday,
        email: args.email,
        classId: args.classId,
        address: args.address,
      }
      students.push(student);
      return { success: true }
    },

    updateStudent: (parent, args, context, info) => {
      if (args.id) {
        const student = students.find(s => s.id === +args.id);

        if (student) {
          student.name = args.name ? args.name : student.name;
          student.birthday = args.birthday ? args.birthday : student.birthday;
          student.email = args.email ? args.email : student.email;
          student.classId = args.classId ? args.classId : student.classId;
          student.address = args.address ? args.address : student.address;



          return { success: true };
        }

      }
      return { success: false }
    },
   
    createCourse: (parent, args, context, info) => {
      const course = {
          id: ((courses.length) + 1).toString(),
          name: args.name,
          description: args.description,
          teacher: args.teacher
      };
      courses.push(course);
      return {success: true};
  },

  updateCourse: (parent, args, context, info) => {
    if (args.id) {
        const course = courses.find(c => c.id === +args.id);
        if (course) {
            course.name = args.name ? args.name : course.name;
            course.description = args.description ? args.description : course.description;
            course.teacher = args.teacher ? args.teacher : course.teacher;

            return {success: true};
        }
    }
    return {success: false}
},

createGrade: (parent, args, context, info) => {
  const grade = {
      id: ((grades.length) + 1),
      studentid: args.studentid,
      courseid: args.courseid,
      grade: args.grade
  };
  grades.push(grade);
  return {success: true}
},

updateGrade: (parent, args, context, info) => {
  if (args.id) {
      const grade = grades.find(g => g.id === +args.id);
      if (grade) {
          grade.studentid = args.studentid ? args.studentid : grade.studentid;
          grade.courseid = args.courseid ? args.courseid : grade.courseid;
          grade.grade = args.grade ? args.grade : grade.grade;
          return {success: true}
      }
  }
  return {success: false}
}

  }

};



const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});