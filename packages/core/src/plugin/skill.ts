export * as SkillPlugin from "./skill"

import { Effect } from "effect"
import { PluginV2 } from "../plugin"
import { AbsolutePath } from "../schema"
import { SkillV2 } from "../skill"

export const CUSTOMIZE_OPENCODE_SKILL_NAME = "customize-opencode"
export const CUSTOMIZE_OPENCODE_SKILL_DESCRIPTION =
  "Use ONLY when the user is editing or creating opencode's own configuration: opencode.json, opencode.jsonc, files under .opencode/, or files under ~/.config/opencode/. Also use when creating or fixing opencode agents, subagents, skills, plugins, MCP servers, or permission rules. Do not use for the user's own application code, or for any project that is not configuring opencode itself."
export const CUSTOMIZE_OPENCODE_SKILL_BODY = await Bun.file(
  new URL("./skill/customize-opencode.md", import.meta.url),
)
  .text()
  .catch(() =>
    [
      "# Customizing opencode",
      "",
      "Use this skill when editing opencode config files, agents, skills, plugins, or MCP server definitions.",
      "Refer to https://opencode.ai/config.json for authoritative schema details.",
      "After changing config files, restart opencode for changes to apply.",
    ].join("\n"),
  )

export const Plugin = PluginV2.define({
  id: PluginV2.ID.make("skill"),
  effect: Effect.gen(function* () {
    const skill = yield* SkillV2.Service
    const transform = yield* skill.transform()

    yield* transform((editor) => {
      editor.source(
        new SkillV2.EmbeddedSource({
          type: "embedded",
          skill: new SkillV2.Info({
            name: CUSTOMIZE_OPENCODE_SKILL_NAME,
            description: CUSTOMIZE_OPENCODE_SKILL_DESCRIPTION,
            location: AbsolutePath.make("/builtin/customize-opencode.md"),
            content: CUSTOMIZE_OPENCODE_SKILL_BODY,
          }),
        }),
      )
    })
  }),
})
