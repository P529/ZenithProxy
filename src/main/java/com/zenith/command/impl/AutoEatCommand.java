package com.zenith.command.impl;

import com.mojang.brigadier.arguments.IntegerArgumentType;
import com.mojang.brigadier.builder.LiteralArgumentBuilder;
import com.zenith.command.Command;
import com.zenith.command.CommandContext;
import com.zenith.command.CommandUsage;
import com.zenith.module.Module;
import com.zenith.module.impl.AutoEat;
import discord4j.rest.util.Color;

import static com.mojang.brigadier.arguments.IntegerArgumentType.integer;
import static com.zenith.Shared.CONFIG;
import static com.zenith.Shared.MODULE_MANAGER;
import static java.util.Arrays.asList;

public class AutoEatCommand extends Command {
    @Override
    public CommandUsage commandUsage() {
        return CommandUsage.args("autoEat",
                "Configures the AutoEat feature",
                asList("on/off", "health <int>", "hunger <int>", "warning on/off"));
    }

    @Override
    public LiteralArgumentBuilder<CommandContext> register() {
        return command("autoeat")
                .then(literal("on").executes(c -> {
                    CONFIG.client.extra.autoEat.enabled = true;
                    MODULE_MANAGER.getModule(AutoEat.class).ifPresent(Module::syncEnabledFromConfig);
                    c.getSource().getEmbedBuilder()
                            .title("AutoEat On!")
                            .color(Color.CYAN)
                            .addField("Health Threshold", "" + CONFIG.client.extra.autoEat.healthThreshold, false)
                            .addField("Hunger Threshold", "" + CONFIG.client.extra.autoEat.hungerThreshold, false)
                            .addField("Warning", Boolean.toString(CONFIG.client.extra.autoEat.warning), false);
                }))
                .then(literal("off").executes(c -> {
                    CONFIG.client.extra.autoEat.enabled = false;
                    MODULE_MANAGER.getModule(AutoEat.class).ifPresent(Module::syncEnabledFromConfig);
                    c.getSource().getEmbedBuilder()
                            .title("AutoEat Off!")
                            .color(Color.CYAN)
                            .addField("Health Threshold", "" + CONFIG.client.extra.autoEat.healthThreshold, false)
                            .addField("Hunger Threshold", "" + CONFIG.client.extra.autoEat.hungerThreshold, false)
                            .addField("Warning", Boolean.toString(CONFIG.client.extra.autoEat.warning), false);
                }))
                .then(literal("health")
                        .then(argument("health", integer(1, 19)).executes(c -> {
                            int health = IntegerArgumentType.getInteger(c, "health");
                            CONFIG.client.extra.autoEat.healthThreshold = health;
                            c.getSource().getEmbedBuilder()
                                    .title("AutoEat Health Threshold Set")
                                    .color(Color.CYAN)
                                    .addField("Health Threshold", "" + CONFIG.client.extra.autoEat.healthThreshold, false)
                                    .addField("Hunger Threshold", "" + CONFIG.client.extra.autoEat.hungerThreshold, false)
                                    .addField("Warning", Boolean.toString(CONFIG.client.extra.autoEat.warning), false);
                            return 1;
                        })))
                .then(literal("hunger")
                        .then(argument("hunger", integer(1, 19)).executes(c -> {
                            int hunger = IntegerArgumentType.getInteger(c, "hunger");
                            CONFIG.client.extra.autoEat.hungerThreshold = hunger;
                            c.getSource().getEmbedBuilder()
                                    .title("AutoEat Hunger Threshold Set")
                                    .color(Color.CYAN)
                                    .addField("Health Threshold", "" + CONFIG.client.extra.autoEat.healthThreshold, false)
                                    .addField("Hunger Threshold", "" + CONFIG.client.extra.autoEat.hungerThreshold, false)
                                    .addField("Warning", Boolean.toString(CONFIG.client.extra.autoEat.warning), false);
                            return 1;
                        })))
                .then(literal("warning")
                        .then(literal("on").executes(c -> {
                            CONFIG.client.extra.autoEat.warning = true;
                            c.getSource().getEmbedBuilder()
                                    .title("AutoEat Warning On!")
                                    .color(Color.CYAN)
                                    .addField("Health Threshold", "" + CONFIG.client.extra.autoEat.healthThreshold, false)
                                    .addField("Hunger Threshold", "" + CONFIG.client.extra.autoEat.hungerThreshold, false)
                                    .addField("Warning", Boolean.toString(CONFIG.client.extra.autoEat.warning), false);
                        }))
                        .then(literal("off").executes(c -> {
                            CONFIG.client.extra.autoEat.warning = false;
                            c.getSource().getEmbedBuilder()
                                    .title("AutoEat Warning Off!")
                                    .color(Color.CYAN)
                                    .addField("Health Threshold", "" + CONFIG.client.extra.autoEat.healthThreshold, false)
                                    .addField("Hunger Threshold", "" + CONFIG.client.extra.autoEat.hungerThreshold, false)
                                    .addField("Warning", Boolean.toString(CONFIG.client.extra.autoEat.warning), false);
                        })));
    }
}
