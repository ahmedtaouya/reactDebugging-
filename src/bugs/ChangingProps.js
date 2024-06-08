import { useEffect, useState } from "react";
import {
  Button,
  Heading,
  Text,
  Box,
  ThumbsRating,
  NameValueList,
  NameValuePair,
} from "grommet";

import Template from "./BugPageTemplate";
import { expect, useBugTest, useBugTestOnce } from "./tests";

const Bug = () => {
  return (
    <Template bug={bug}>
      <CrimsonCaterpillar
        liked={null}
        level={1}
        attributes={{
          Health: 50,
          Attack: 20,
          Defense: 55,
          "Sp. Attack": 25,
          "Sp. Defense": 25,
          Speed: 30,
          Moves: ["Tackle", "Harden"],
        }}
      />
    </Template>
  );
};

const CrimsonCaterpillar = ({ liked, attributes }) => {
  const [likeValue, setLikeValue] = useState(liked);

  const handleOnChange = (value) => {
    setLikeValue(value);
  };

  useBugTest("should be liked", ({ findByTestId }) => {
    expect(findByTestId("liked")).to.have.attr("data-liked", likeValue);
  });

  return (
    <>
      <Heading level={3}>{bug.name}</Heading>
      <LikeButton liked={likeValue} onChange={handleOnChange} />
      <BugAttributes attributes={attributes} />
    </>
  );
};

const LikeButton = ({ liked, onChange }) => {
  const handleOnChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Box direction="row">
      <ThumbsRating
        name="liked"
        data-test="liked"
        data-liked={liked}
        value={liked}
        onChange={handleOnChange}
      />
    </Box>
  );
};

function BugAttributes({ attributes }) {
  const [level, setLevel] = useState(1);
  const [hasLeveledUp, setHasLeveledUp] = useState(false);

  const modifiedAttributes = { ...attributes };

  Object.entries(modifiedAttributes).forEach(([key, value]) => {
    if (typeof value === "number") {
      modifiedAttributes[key] = value + (level - 1) * 2;
    }
  });

  const onLevelUp = () => {
    setLevel((prevLevel) => prevLevel + 1);
    setHasLeveledUp(true);
  };

  const onLevelDown = () => {
    setLevel((prevLevel) => prevLevel - 1);
    setHasLeveledUp(false);
  };

  useBugTestOnce("should increase stats on level up", ({ findByTestId }) => {
    const health = parseInt(findByTestId("attribute: Health").innerText, 10);

    expect(hasLeveledUp).to.be.true;
    expect(health).to.be.above(50);
  });

  useBugTestOnce("should reset stats at level 1", ({ findByTestId }) => {
    const health = parseInt(findByTestId("attribute: Health").innerText, 10);

    expect(hasLeveledUp).to.be.false;
    expect(health).to.equal(50);
  });

  return (
    <Box>
      <Heading level={3}>Attributes</Heading>
      <Box
        direction="row"
        gap="small"
        align="center"
        margin={{ bottom: "medium" }}
      >
        <Text color="text-weak">Level {level}</Text>
        <Button
          onClick={onLevelDown}
          disabled={level <= 1}
          label="level down"
        />
        <Button
          primary
          onClick={onLevelUp}
          disabled={level >= 100}
          label="level up"
        />
      </Box>
      <NameValueList>
        {Object.entries(modifiedAttributes).map(([key, value]) => (
          <NameValuePair key={key} name={key}>
            <Text color="text-strong" data-test={`attribute: ${key}`}>
              {typeof value === "object" ? value.join(", ") : value}
            </Text>
          </NameValuePair>
        ))}
      </NameValueList>
    </Box>
  );
}

export const bug = {
  title: "Changing Props",
  subtitle:
    "this crimson caterpillar can cause confusion and chaos when trying to modify props or state",
  name: "Crimson Caterpillar",
  price: "$7.99",
  route: "/bug/crimson-caterpillar",
  component: Bug,
};

export default Bug;
