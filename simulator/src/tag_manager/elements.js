import { resetup } from '../setup';
import { addOperatorButtonTriggered, applyCreatedElement, createElement } from '../ux';

function LoadTagManager() {
    console.log("toggled to show loadTagManager...");

    $('#TagPanel').show();
    $('#Touch-Ce-Menu').appendTo('#TagPanel').show();
    $('#moduleProperty-inner').appendTo('#TagPanel').show();
    // $('.TagOverlayOffer').show();
    $('#TagPanel').dialog({
        // resizable: true,
        resizable: false,
        width: '60%',
        height: '700',
        draggable: false,
        create(event, ui) {
            $(this).css("background-color", "#a5dfc5"); // orange
        },
        close() {
            $('#TouchCe-panel').hide();
            // $('.TagOverlayOffer').hide();
        },
        buttons: [{
            text: "Add operator",
            click() {
                // $('.logixModules').mousedown(createElement);
                // $('.TagOverlayOffer').hide();
                applyCreatedElement();
                // eslint-disable-next-line no-import-assign
                $(this).dialog('close');
            },
        },
        {
            text: "Continue",
            click() {
                $(this).dialog('close');
                // $('.TagOverlayOffer').hide();
            },
        }],
    });
    $('#TouchCe-panel').focus();
}

export default LoadTagManager;
