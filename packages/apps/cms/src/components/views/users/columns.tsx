
import api_points from "@/api/points";
import { IColumn, IColumnEnum } from "@/components/elements/table/type";
import route_paths from "@/helper/route_paths";

const columns: IColumn[] = [
    {
        title: "User Name",
        dataIndex: "userName",
    },
    {
        title: "Email",
        dataIndex: "email",
    },
    {
        title: "Phone Number",
        dataIndex: "phoneNumber",
    },
    {
        title: "state",
        dataIndex: "emailConfirmed",
        type: IColumnEnum.booleanState,
        data: [
            {
                true: "Confirmed",
                color: "green"
            },
            {

                color: "red",
                false: "Not Confirmed"
            }
        ]
    },
    {
        title: "Publish State",
        dataIndex: "published",
        type: IColumnEnum.switch,
        url: api_points.users.changeState
    },
    {
        title: "Actions",
        dataIndex: "id",
        type: IColumnEnum.actions,
        edit_url: `${route_paths.users}/edit`,
        confirm_email_url:  api_points.users.confirmEmail,
        delete_url: api_points.users.delete,
    }
];

export default columns;