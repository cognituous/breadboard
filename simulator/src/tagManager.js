// eslint-disable-next-line import/no-cycle

// eslint-disable-next-line import/prefer-default-export
function newTagManager(){
    console.log("new tag manager called");

    $('#tagManagementDialog').empty().append('<div id="dialogContainer"></div>');


    // $('#dialogContainer').appendTo('#tagManagementDialog').show();
    // $('#TouchCe-panel').show();
    // $('#moduleProperty').show();
    $('#TouchCe-panel').appendTo('#dialogContainer').show();
    $('#moduleProperty-inner').appendTo('#dialogContainer').show();
    const itemId = $(this).attr('id');
    console.log("itemID : " + itemId);
    $('#tagManagementDialog').dialog({
        resizable: true,
        close() {
            $('#TouchCe-panel, #moduleProperty-inner').hide();
        },
        buttons: [{
            text: "Attach the tag/operator",
            click() {
            },
        },
        {
            text: "Continue",
            click() {
                $('#TouchCe-panel').hide();
                $(this).dialog('close');
            },
        }],
    });
}

export default newTagManager;
