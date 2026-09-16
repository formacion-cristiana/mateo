This version:

    Transposes the correctAnswer matrix if question.transpose is true.

    Updates logic consistently to use the effectiveAnswer.

    Works whether or not transpose is present.
    
    ✅ correctAnswer is transposed if question.transpose is true.

✅ If transposed: columns → rowHeaders, rowHeaders → columns.

✅ Option sets and selections are reset accordingly.