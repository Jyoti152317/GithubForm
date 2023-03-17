  var baseUrl="http://api.login2explore.com:5577";
           var jpdbIRL="/api/irl";
           var jpdbIML="/api/iml";
           var dbName="SCHOOL-DB";
           var relName="STUDENT-TABLE";
           var connToken="90932982|-31949275716089996|90949426";

           $("#rollNo").focus();

           function saveRecNo2LS(jsonObj){
            var lvData=JSON.parse(jsonObj.data);
            localStorage.setItem("recno",lvData.rec_no);
           }

           function getEmpIdAsJsonObj(){
            var rollNo=$("#rollNo").val();
            var jsonStr={
                rollNo:rollNo
            };
            return JSON.stringify(jsonStr);
           }

            
            function validateData() {
                var rollNo, stuName, class1, dob, address, eDate;
                rollNo = $("#rollNo").val();
                stuName=$("#stuName").val();
                class1 = $("#class1").val();
                dob=$("#dob").val();
                address = $("#address").val();
                eDate=$("#eDate").val();
                if (rollNo === "") {
                    alert("Roll Number is missing");
                    $("#rollNo").focus();
                    return "";
                }
                if (stuName === "") {
                    alert("Student Name is missing");
                    $("#stuName").focus();
                    return "";
                }
                if (class1 === "") {
                    alert("class is missing");
                    $("#class1").focus();
                    return "";
                }
               if (dob === "") {
                    alert("Date-of-Birth is missing");
                    $("#dob").focus();
                    return "";
                }
                if (address === "") {
                    alert("Address is missing");
                    $("#address").focus();
                    return "";
                }
                if (eDate === "") {
                    alert("Enrollment Date is missing");
                    $("#eDate").focus();
                    return "";
                }
                jsonStrObj={
                    rollNo:rollNo,
                    name:stuName,
                    class:class1,
                    DOB:dob,
                    address:address,
                    enrollmentDate:eDate
                };

                return JSON.stringify(jsonStrObj);
            }

            function getStudent(){
                var empIdJsonObj=getEmpIdAsJsonObj();
                var getRequest=createGET_BY_KEYRequest(connToken, dbName, relName, empIdJsonObj);
                jQuery.ajaxSetup({async: false});
                var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,baseUrl, jpdbIRL);
                jQuery.ajaxSetup({async: true});
                if(resJsonObj.status===400){
                    $("#save").prop("disabled",false);
                    $("#reset").prop("disabled",false);
                    $("#stuName").focus();
                }
                else if(resJsonObj.status===200){
                    $("#rollNo").prop("disabled", true);
                    fillData(resJsonObj);

                     $("#change").prop("disabled",false);
                    $("#reset").prop("disabled",false);
                    $("#stuName").focus();
                }
            }

            function fillData(jsonObj){
                saveRecNo2LS(jsonObj);
                var data=JSON.parse(jsonObj.data).record;
                 $("#stuName").val(data.name);
                $("#class1").val(data.class);
                $("#dob").val(data.DOB);
                $("#address").val(data.address);
                $("#eDate").val(data.enrollmentDate);
            }

            function resetForm() {
                $("#rollNo").val("");
                $("#stuName").val("");
                $("#class1").val("");
                $("#dob").val("");
                $("#address").val("");
                $("#eDate").val("");
                $("#rollNo").prop("disabled",false);
                $("#save").prop("disabled",true);
                $("#change").prop("disabled",true);
                $("#reset").prop("disabled",true);
                $("#rollNo").focus();
            }
            function saveData() {
                var jsonStrObj = validateData();
                if (jsonStrObj === "") {
                    return "";
                }
                var putReqStr = createPUTRequest(connToken, jsonStrObj, dbName, relName);
                jQuery.ajaxSetup({async: false});
                var resJsonObj = executeCommandAtGivenBaseUrl(putReqStr, baseUrl, jpdbIML);
                jQuery.ajaxSetup({async: true});
//                alert(JSON.stringify(resJsonObj));
               resetForm();
               $("#rollNo").focus();
            }

            function changeData(){
                $("#change").prop("disabled",true);
                jsonChg=validateData();
                var updateRequest=createUPDATERecordRequest(connToken, jsonChg, dbName, relName, localStorage.getItem("recno"));
                jQuery.ajaxSetup({async: false});
                var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, baseUrl, jpdbIML);
                jQuery.ajaxSetup({async: true});
                // console.log(resJsonObj);
                resetForm();
               $("#rollNo").focus();
            }
