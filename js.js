"use strict";
    $(document).ready(function(){
        /*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */

        /*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */
        var gNameCol = ["id", "name", "birthday", "email", "phone", "action"];
        const gID_COL = 0;
        const gNAME_COL = 1;
        const gBIRTHDAY_COL = 2;
        const gEMAIL_COL = 3;
        const gPHONE_COL = 4;
        const gACTION_COL = 5;
        var gDataTable = $("#user-table").DataTable({
            columns: [
                {data: gNameCol[0]},
                {data: gNameCol[1]},
                {data: gNameCol[2]},
                {data: gNameCol[3]},
                {data: gNameCol[4]},
                {data: gNameCol[5]},
            ],
            columnDefs: [
                {
                  targets: 5,
                  defaultContent: "<button class='btn btn-primary edit'>Sửa</button>" + "  " + "<button class='btn btn-danger delete'>Xóa</button>"
                },
              
              ]
        })
        onPageLoading();
        // Hàm xử lý khi ấn nút sửa
        $("#user-table").on("click", ".edit", function(){
            onBtnEditClick(this);
        });
        // Hàm xử lý khi ấn nút xóa
        $("#user-table").on("click", ".delete", function(){
            onBtnDeleteClick(this);
        })
        // Khi ấn nút thêm sinh viên hiện modal chi tiết
        $("#btn-add-student").on("click", function(){
            $("#Add-Modal").modal("show")
        })
        // Hàm xử lý khi ấn nút thêm trên modal
        $("#btn-modal-add-student").on("click", function(){
            onBtnSaveClick()
        })
        // Hàm xử lý khi ấn nút edit trên modal
        $("#btn-modal-edit-student").on("click", function(){
            onBtnSaveEditClick()
        })
        // Hàm xử lý khi ấn nút delete trên modal
        $("#btn-modal-delete-student").on("click", function(){
            onBtnDeleteModalClick()
        })
        // Hàm xử lý khi ấn nút lọc
        $("#btn-fillter").on("click", function(){
            onBtnFillterClick();
        })
        /*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */  
        // Hàm xử lý sự kiện Load trang
        // Call Api lấy dữ liệu về
        // Đổ dữ liệu ra bảng
        function onPageLoading(){
            // Gọi Api
            $.ajax({
                url: "https://devcamp-student-datatables.herokuapp.com/users/",
                type: "GET",
                dataType: 'json',
                success: function(responseObject){
                    console.log(responseObject)
                    // Hiển thị ra bảng
                    LoadDataToTable(responseObject)
                },
                error: function(error){
                    console.assert(error.responseText);
                }
            });
        }
        // hàm xử lý khi ấn nút thêm ở modal
        // thu thập dữ liệu, validate dữ liệu
        // Gọi Api thêm mới học viên
        function onBtnSaveClick(){
            console.log("Nút thêm được ấn")
            // khai báo đối tượng chứa dữ liệu
            var vNewStudentData = {
                name: "",
                email: "",
                phone: "",
                birthday: ""
            }
            // thu thập dữ liệu
            getData(vNewStudentData);
            // Kiểm tra dữ liệu
            var vIsValidateData = validateData(vNewStudentData);
            // Nếu dữ liệu hợp lệ
            if (vIsValidateData){
                // Gọi Api thêm mới dữ liệu
                $.ajax({
                    url: "https://devcamp-student-datatables.herokuapp.com/users/",
                    type: 'POST',
                    data: JSON.stringify(vNewStudentData),
                    contentType: "application/json", 
                    success: function (res) {
                    console.log(res);
                    alert("Thêm mới dữ liệu thành công")
                    location.reload();
                    },
                    error: function (ajaxContext) {
                    alert(ajaxContext.responseText)
                    }
                });
            }
        }
        // Hàm xử lý khi ấn nút lọc
        // Thu thập thông tin email, validate
        // Hiển thị lại bảng
        function onBtnFillterClick(){
            console.log("Nút lọc được ấn")
            // Khai báo đối tượng chứa dữ liệu
            var vEmailFillter = {
                email: ""
            }
            // Thu thập thông tin
            getEmailFillter(vEmailFillter)
            // Kiểm tra dữ liệu
            var vIsValidateEmail = validateEmailFillterData(vEmailFillter)
            // Nếu dữ liệu hợp lệ
            if (vIsValidateEmail) {
                // gọi Api
                $.ajax({
                    url: "https://devcamp-student-datatables.herokuapp.com/users?email=" + vEmailFillter.email,
                    type: "GET",
                    dataType: 'json',
                    success: function(responseObject){
                        console.log(responseObject)
                        // Hiển thị thông tin ra bảng
                        loadNewDataToTable(responseObject)
                    },
                    error: function(error){
                        console.assert(error.responseText);
                    }
                });
                
            }
        }
        /*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/
        // Hàm đổ dưc liệu ra bảng
        function LoadDataToTable(paramRes){
            gDataTable.clear();
            gDataTable.rows.add(paramRes);
            gDataTable.draw();
        }
        // Hàm xử lý khi ấn nút chỉnh sửa
        function onBtnEditClick(paramElement){
            console.log("Nút Chỉnh sửa được ấn");
            // Lấy thông tin của từng dòng được ấn
            var vRowClick = $(paramElement).closest("tr");
            var vTable = $("#user-table").DataTable();
            var vDataRow = vTable.row(vRowClick).data();
            console.log(vDataRow.id);
            // Load thông tin lên Modal
            LoadDatatoEditModal(vDataRow)
            $("#Edit-Modal").modal("show")
        }
        // Hàm xử lý khi ấn nút xóa
        function onBtnDeleteClick(paramElement){
            console.log("Nút xóa được ấn");
            // Lấy thông tin của từng dòng được ấn
            var vRowClick = $(paramElement).closest("tr");
            var vTable = $("#user-table").DataTable();
            var vDataRow = vTable.row(vRowClick).data();
            console.log(vDataRow.id);

            // Đưa thông tin id lên modal ẩn
            $("#delete-id").val(vDataRow.id)
            $("#Delete-Modal").modal("show")
        }
        // Hàm xử lý khi ấn nút lưu trên edit modal
        // thu thập - kiểm tra thông tin
        // gọi Api update thông tin
        function onBtnSaveEditClick(){
            // Khai báo đối tượng chứa dữ liệu
            var vEditData = {
                name: "",
                email: "",
                phone: "",
                birthday: ""
            }
            var vId = {
                id: ""
            }
            vId.id = $("#ipn-id").val()
            // thu thập dữ liệu Edit
            getDataForEdit(vEditData)
            // Kiểm tra dữ liệu
            var vIsEditValidate = validateEditData(vEditData)
            // Nếu dữ liệu hợp lệ
            if (vIsEditValidate){
                // Gọi Api Update
                $.ajax({
                    url: "https://devcamp-student-datatables.herokuapp.com/users/" + vId.id,
                    type: 'PUT',
                    data: JSON.stringify(vEditData),
                    contentType: "application/json", 
                    success: function (res) {
                    console.log(res);
                    alert("Cập nhật dữ liệu thành công")
                    location.reload();
                    },
                    error: function (ajaxContext) {
                    alert(ajaxContext.responseText)
                    }
                });
            }
        }
        // Hàm xử lý khi ấn nút xác nhận xóa urser
        function onBtnDeleteModalClick(){
            // khai báo id delete
            var vDeleteId = {
                id: ""
            }
            // thu thập thông tin id
            vDeleteId.id = $("#delete-id").val()
            // Call Api Xóa
            $.ajax({
                url: "https://devcamp-student-datatables.herokuapp.com/users/" + vDeleteId.id,
                type: 'DELETE',
                data: JSON,
                contentType: "application/json", 
                success: function (res) {
                console.log(res);
                alert("Xóa User thành công!");
                location.reload();
                },
                error: function (ajaxContext) {
                alert(ajaxContext.responseText)
                }
            }); 
        }
        // Hàm thu thập dữ liệu cho thêm học viên
        function getData(paramNewStudentData){
            paramNewStudentData.name = $("#ipn-name").val();
            paramNewStudentData.email = $("#ipn-email").val();
            paramNewStudentData.phone = $("#ipn-phone").val();
            paramNewStudentData.birthday = $("#ipn-birthday").val();
        }
        // Hàm thu thông tin cho nút lọc
        function getEmailFillter(paramEmailFillter){
            paramEmailFillter.email = $("#inp-fillter").val()
        }
        // Hàm kiểm tra dữ liệu cho thêm sinh viên
        function validateData(paramNewStudentData){
            if (paramNewStudentData.name == ""){
                alert("Chưa nhập tên")
                return false
            }
            if (paramNewStudentData.birthday == ""){
                alert("Chưa nhập ngày sinh")
                return false
            }
            if (paramNewStudentData.email == ""){
                alert("Chưa nhập Email")
                return false
            }
            if (!validateEmail(paramNewStudentData.email)) {
                alert("Email nhập vào không hợp lệ");
                $('#ipn-email').focus();
                return false;
            }
            if(isNaN(paramNewStudentData.phone)){
                alert("Số điện thoại không hợp lệ")
                return false
            }
            if (paramNewStudentData.phone == ""){
                alert("Chưa nhập số điện thoại")
                return false
            }
            return true

        }
        // Hàm kiểm tra thông tin Email lọc
        function validateEmailFillterData(paramEmailFillter){
            if (paramEmailFillter.email == ""){
                alert("chưa nhập email")
                return false
            }
            if (!validateEmailFillter(paramEmailFillter.email)) {
                alert("Email nhập vào không hợp lệ");
                $('#ipn-email').focus();
                return false;
            }
            return true
        }
        // Hàm kiểm tra email
        function validateEmail(paramEmail) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(paramEmail).toLowerCase());
        }
        // Hàm kiểm tra email fillter
        function validateEmailFillter(paramEmail) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(paramEmail).toLowerCase());
        }
        // Hàm hiển thị thông tin dòng lên Modal Edit
        function LoadDatatoEditModal(paramRowData){
            console.log(paramRowData)
            $("#ipn-name-edit").val(paramRowData.name);
            $("#ipn-email-edit").val(paramRowData.email);
            $("#ipn-phone-edit").val(paramRowData.phone);
            $("#ipn-birthday-edit").val(paramRowData.birthday);
            $("#ipn-id").val(paramRowData.id)
        }
        // Hàm hiển thị thông tin lọc
        function loadNewDataToTable(paramNewData){
            gDataTable.clear();
            gDataTable.rows.add(paramNewData);
            gDataTable.draw();
        }
        // Hàm thu thập thông tin cho edit
        function getDataForEdit(paramEditData){
            paramEditData.name = $("#ipn-name-edit").val();
            paramEditData.email = $("#ipn-email-edit").val();
            paramEditData.phone = $("#ipn-phone-edit").val();
            paramEditData.birthday = $("#ipn-birthday-edit").val();
        }
        // Hàm kiểm tra thông tin cho Edit
        function validateEditData(paraparamEditDatam){
            if (paraparamEditDatam.name == ""){
                alert("Chưa nhập tên")
                return false
            }
            if (paraparamEditDatam.birthday == ""){
                alert("Chưa nhập ngày sinh")
                return false
            }
            if (paraparamEditDatam.email == ""){
                alert("Chưa nhập Email")
                return false
            }
            if (!validateEditEmail(paraparamEditDatam.email)) {
                alert("Email nhập vào không hợp lệ");
                $('#ipn-email').focus();
                return false;
            }
            if(isNaN(paraparamEditDatam.phone)){
                alert("Số điện thoại không hợp lệ")
                return false
            }
            if (paraparamEditDatam.phone == ""){
                alert("Chưa nhập số điện thoại")
                return false
            }
            return true
        }
        // Hàm kiểm tra email
        function validateEditEmail(paramEmail) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(paramEmail).toLowerCase());
        }


    });


   