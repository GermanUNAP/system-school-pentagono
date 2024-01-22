
function handleExcelUpload () {
    const excelFileInput = document.getElementById('excelFileInput');
    const file = excelFileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = async (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];


            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });


            console.log(jsonData);
            alert('Información cargada exitosamente desde Excel.');
        };

        reader.readAsBinaryString(file);
    } else {
        alert('Por favor, selecciona un archivo Excel válido.');
    }
}