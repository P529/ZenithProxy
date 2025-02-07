package com.zenith.network.client.handler.incoming;

import com.github.steveice10.mc.protocol.packet.ingame.clientbound.level.ClientboundSetTimePacket;
import com.zenith.network.client.ClientSession;
import com.zenith.network.registry.AsyncIncomingHandler;

import static com.zenith.Shared.TPS_CALCULATOR;

public class SetTimeHandler implements AsyncIncomingHandler<ClientboundSetTimePacket, ClientSession> {

    @Override
    public boolean applyAsync(ClientboundSetTimePacket packet, ClientSession session) {
        TPS_CALCULATOR.handleTimeUpdate(packet);
        return true;
    }
}
