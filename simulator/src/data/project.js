/* eslint-disable guard-for-in */
/* eslint-disable no-bitwise */
/* eslint-disable import/no-cycle */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import { resetScopeList, scopeList, newCircuit } from '../circuit';
import { showMessage, showError, generateId } from '../utils';
import { checkIfBackup } from './backupCircuit';
import { generateSaveData, getProjectName, setProjectName } from './save';
import load from './load';
import ImportCircuitFiles from '../file/Open';
import updateThemeForStyle from '../themer/themer';
import { applyCreatedElement } from '../ux';
import ApplyProjectLayout from '../project_manager/hierarchy';
/**
 * Helper function to recover unsaved data
 * @category data
 */
export function recoverProject() {
    if (localStorage.getItem('recover')) {
        var data = JSON.parse(localStorage.getItem('recover'));
        if (confirm(`Would you like to recover: ${data.name}`)) {
            load(data);
        }
        localStorage.removeItem('recover');
    } else {
        showError('No recover project found');
    }
}

/**
 * Prompt to restore from localStorage
 * @category data
 */
export function openOffline() {
    $('#openProjectDialog').empty();
    const projectList = JSON.parse(localStorage.getItem('projectList'));
    let flag = true;
    for (id in projectList) {
        flag = false;
        $('#openProjectDialog').append(`<label class="option custom-radio"><input type="radio" name="projectId" value="${id}" />${projectList[id]}<span></span><i class="fa fa-trash deleteOfflineProject" onclick="deleteOfflineProject('${id}')"></i></label>`);
    }
    if (flag) $('#openProjectDialog').append('<p>Looks like no circuit has been saved yet. Create or upload a new one and save it!</p>');
    $('#openProjectDialog').dialog({
        resizable: false,
        width: 'auto',
        buttons: !flag ? [{
            id: 'Open_offline_btn',
            text: 'Open Project',
            click() {
                if (!$('input[name=projectId]:checked').val()) return;
                load(JSON.parse(localStorage.getItem($('input[name=projectId]:checked').val())));
                window.projectId = $('input[name=projectId]:checked').val();
                $(this).dialog('close');
            },
        }] : [{
            text: 'Open CV File',
            click() {
                $(this).dialog('close');
                ImportCircuitFiles();
            },
        }],

    });
}
/**
 * Flag for project saved or not
 * @type {boolean}
 * @category data
 */
var projectSaved = true;
export function projectSavedSet(param) {
    projectSaved = param;
}

/**
 * Helper function to store to localStorage -- needs to be deprecated/removed
 * @category data
 */
export function saveOffline() {
    const data = generateSaveData();
    localStorage.setItem(projectId, data);
    const temp = JSON.parse(localStorage.getItem('projectList')) || {};
    temp[projectId] = getProjectName();
    localStorage.setItem('projectList', JSON.stringify(temp));
    showMessage(`We have saved your project: ${getProjectName()} in your browser's localStorage`);
}

/**
 * Checks if any circuit has unsaved data
 * @category data
 */
function checkToSave() {
    let saveFlag = false;
    // eslint-disable-next-line no-restricted-syntax
    for (id in scopeList) {
        saveFlag |= checkIfBackup(scopeList[id]);
    }
    return saveFlag;
}

/**
 * Prompt user to save data if unsaved
 * @category data
 */
window.onbeforeunload = function () {
    if (projectSaved || embed) return;

    if (!checkToSave()) return;

    alert('You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?');
    const data = generateSaveData('Untitled');
    localStorage.setItem('recover', data);
    // eslint-disable-next-line consistent-return
    return 'Are u sure u want to leave? Any unsaved changes may not be recoverable';
};

/**
 * Function to clear project
 * @category data
 */
export function clearProject() {
    if (confirm('Would you like to clear the project?')) {
        globalScope = undefined;
        resetScopeList();
        $('.circuits').remove();
        newCircuit('main');
        showMessage('Your project is as good as new!');
    }
}

/**
 Function used to start a new project while prompting confirmation from the user
 * @param {boolean} verify - flag to verify a new project
 * @category data
 */
export function newProject(verify) {
    if (verify || projectSaved || !checkToSave()) {
        // || confirm('What you like to start a new project? Any unsaved changes will be lost.')) {
        // console.log("about to clear the project");

        clearProject();
        localStorage.removeItem('recover');
        // window.location = '/simulator';

        $('#projectManagerDialogForm').show();
        // $('.TagOverlayOffer').show();
        $('#projectManagerDialogForm').dialog({
            // resizable: true,
            resizable: false,
            draggable: false,
            create(event, ui) {
                $(this).css("background-color", "#a5dfc5"); // orange
            },
            close() {
                $('#TouchCe-panel').hide();
                // $('.TagOverlayOffer').hide();
            },
            buttons: [
                {
                    text: "Apply",
                    click() {
                        var projectName = $("#projectNameValue").val();
                        var targetSelection = $("#targetNameValue").val();
                        console.log("### project name : " + projectName + " | target value : " + targetSelection);

                        var projectData = [
                            {
                                "name": projectName,
                                "type": "directory",
                                "children": [
                                    {
                                        "name": targetSelection + " [Master]",
                                        "type": "directory",
                                        "children": [
                                            {
                                                "name": "Logic sheet1",
                                                "type": "file"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ];

                        console.log(projectData);

                        // eslint-disable-next-line no-undef
                        $.ajax({
                            url: '/simulator/generate_project_metadata',
                            method: 'POST',
                            data: JSON.stringify(projectData),
                            contentType: 'application/json; charset=utf-8',
                            success: function(response) {
                                console.log(response);
                                setProjectName(undefined);
                                projectId = generateId();
                                showMessage('New Project has been created!');

                                ApplyProjectLayout('/data/project_1.json');
                            },
                            error: function(error) {
                                showMessage(error);
                            }
                        });
                        $(this).dialog('close');
                    },
                },
                {
                    text: "Cancel",
                    click() {
                        // eslint-disable-next-line no-undef
                        $(this).dialog('close');
                    },
                }],
        });
    }
}
