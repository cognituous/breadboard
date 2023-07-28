import { createNewCircuitScope } from '../circuit';

function ApplyProjectLayout(projectName) {
    var urlString = projectName ? projectName : '/data/project_hierarchy1.json';

    // TODO: here ajax should get the latest added hierarchy json file
    // eslint-disable-next-line no-undef
    $.ajax({
        url: urlString,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            // eslint-disable-next-line no-undef
            var $sidebar = $('#project-explore-sidebar');
            $sidebar.empty();
            data.forEach(function(item) {
                $sidebar.append(buildSidebarItem(item));
            });
            // eslint-disable-next-line no-undef
            // foldingAnimation();
        },
        error: function() {
            console.log('Error loading JSON data');
        }
    });
}

var ctxPos = {
    x: 0,
    y: 0,
    visible: false,
};

function hideProjectContextMenu() {
    var el = document.
        getElementById('projectContextMenu');

    el.style = 'opacity:9;';

    setTimeout(() => {
        el.style = 'visibility:hidden;';
        ctxPos.visible = false;
    }, 200); // Hide after 2 sec

    // eslint-disable-next-line no-undef
    $('#projectContextMenu').remove();

    $(document).click(function(e) {
        if (!$(e.target).closest('#projectContextMenu').length) {
            $('#projectContextMenu').hide();
        }
    });

    $('#projectContextMenu').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
    });
}

function buildSidebarItem(item) {
    // eslint-disable-next-line no-undef
    var $li = $('<li>').text(item.name);

    // eslint-disable-next-line no-undef
    var prjCtxtMenu = $('<ul>').attr('id', 'projectContextMenu').addClass('dropdown-menu')
        // eslint-disable-next-line no-undef
        .append($('<li>')
            .attr('id', 'newLogicSheet')
            .text(' New Circuit ✚ ')
            .on('click', function() {
                hideProjectContextMenu();
                createNewCircuitScope();
            })
        );

    if (item.type === 'directory') {
        // eslint-disable-next-line no-undef
        var $ul = $('<ul>').hide();
        item.children.forEach(function(child) {
            $ul.append(buildSidebarItem(child));
        });

        $li.append($ul);
        $li.click(function(e) {
            e.stopPropagation();
            console.log('project-explore-sidebar click event triggered!');
            // eslint-disable-next-line no-undef
            $(this).children('ul').toggle();
        });

        $li.contextmenu(function (e) {
            e.preventDefault();
            console.log('project-explore-sidebar ctxtmenu event triggered!');

            // eslint-disable-next-line no-undef
            $('body').append(prjCtxtMenu);

            // eslint-disable-next-line no-undef
            $('#projectContextMenu').css({
                // visibility: 'visible',
                visibility: 'visible',
                display: "block",
                backgroundColor: "black",
                color: "white",
                left: e.pageX,
                top: e.pageY
            });
        });
    }
    return $li;
}

export default ApplyProjectLayout;
