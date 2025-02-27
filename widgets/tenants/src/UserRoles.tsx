// @ts-nocheck File not migrated fully to TS

export default function UserRoles({ tenant, user }) {
    function groupGroupsByRole(groups) {
        const roles = {};

        _.forEach(groups, (group, name) => {
            if (_.includes(group.users, user)) {
                if (_.has(roles, group.role)) {
                    roles[group.role].push(name);
                } else {
                    roles[group.role] = [name];
                }
            }
        });
        return roles;
    }

    const { RolesPresenter } = Stage.Common;

    const directRole = tenant.user_roles.direct[user];
    const groupRoles = groupGroupsByRole(tenant.user_roles.groups);

    return <RolesPresenter directRole={directRole} groupRoles={groupRoles} />;
}

UserRoles.propTypes = {
    tenant: PropTypes.shape({
        user_roles: PropTypes.shape({ direct: PropTypes.shape({}), groups: PropTypes.shape({}) })
    }).isRequired,
    user: PropTypes.string.isRequired
};
