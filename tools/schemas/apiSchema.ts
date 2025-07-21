export default {
    "/people": {
        "description": "Central authentication and people management service for a church management system",
        "parameters": {
            "gender": {
                "type": "string",
                "value": ["male", "female", "unspecified"],
            },
            "birthDate": {
                "type": "string",
                "format": "date",
            },
            "birthMonth": {
                "type": "string",
            },
            "age": {
                "type": "number"
            },
            "firstName": {
                "type": "string",
            },
            "middleName": {
                "type": "string",
            },
            "lastName": {
                "type": "string",
            },
            "nickName": {
                "type": "string",
            },
            "maritalStatus": {
                "type": "string",
                "value": ["single", "married", "divorced", "widowed", "unknown"],
            },
            "anniversary": {
                "type": "string",
                "format": "date",
            },
            "anniversaryMonth": {
                "type": "string",
            },
            "yearsMarried": {
                "type": "number"
            },
            "membershipStatus": {
                "type": "string",
                "value": ["visitor", "regularAttendee", "member", "staff", "inactive"],
            },
            "email": {
                "type": "string",
            },
            "city": {
                "type": "string",
            },
            "state": {
                "type": "string",
            },
            "zip": {
                "type": "string"
            },
            "homePhone": {
                "type": "string",
            },
            "workPhone": {
                "type": "string",
            },
            "cellPhone": {
                "type": "string",
            },
        },
        "operators": ["equals", "startsWith", "endsWith", "contains", "greaterThan", "greaterThanEqual", "lessThan", "lessThanEqual", "notEqual"]
    }
}