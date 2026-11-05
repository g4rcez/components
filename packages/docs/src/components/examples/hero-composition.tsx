import { Button, Progress, Switch, Tag } from "@g4rcez/components";

/** Static-looking, fully live composition of library components shown beside the hero copy. */
export const HeroComposition = () => (
    <div className="landing-composition" role="group" aria-label="Component composition preview">
        <div className="landing-composition-row">
            <span className="landing-composition-title">Deploy status</span>
            <Tag theme="success" appearance="soft">
                Healthy
            </Tag>
        </div>
        <Progress value={72} label="Build" />
        <Switch defaultChecked>Notify on failure</Switch>
        <div className="landing-composition-actions">
            <Button theme="neutral" size="small">
                Cancel
            </Button>
            <Button theme="primary" size="small">
                Promote
            </Button>
        </div>
    </div>
);
